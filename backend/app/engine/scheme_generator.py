"""
优化版转图引擎 - 主控模块
结合感知匹配与可制作性后处理（孤立点清理/小区域合并/边缘保护）
"""
import numpy as np
from typing import Dict, List, Tuple

from app.engine.pixelizer import Pixelizer
from app.engine.color_reducer import ColorReducer
from app.engine.palette_matcher import PaletteMatcher


DEFAULT_EDGE_RATIO_THRESHOLD = 0.15
DEFAULT_EDGE_PROTECT_DELTA_E = 20.0


class SchemeGenerator:
    """三方案生成器：协调各模块完成端到端转图"""

    POST_PROCESS_CONFIGS = {
        "simple": {
            "merge_min_region_size": 4,
            "merge_delta_e": 12.0,
            "edge_ratio_threshold": 0.15,
            "edge_protect_delta_e": 20.0,
            "isolate_support_threshold": 1,
            "auto_remove_background": True,
        },
        "standard": {
            "merge_min_region_size": 4,
            "merge_delta_e": 12.0,
            "edge_ratio_threshold": 0.15,
            "edge_protect_delta_e": 20.0,
            "isolate_support_threshold": 1,
            "auto_remove_background": False,
        },
        "fine": {
            "merge_min_region_size": 3,
            "merge_delta_e": 10.0,
            "edge_ratio_threshold": 0.20,
            "edge_protect_delta_e": 18.0,
            "isolate_support_threshold": 0,
            "auto_remove_background": False,
        },
    }

    def __init__(self):
        self.pixelizer = Pixelizer()
        self.color_reducer = ColorReducer()

    def generate(self, image: np.ndarray, palette: List[Dict]) -> List[Dict]:
        schemes = []
        for scheme_type, config in Pixelizer.SCHEME_CONFIGS.items():
            schemes.append(self._generate_single_scheme(image, palette, scheme_type, config))
        return schemes

    def _generate_single_scheme(
        self, image: np.ndarray, palette: List[Dict], scheme_type: str, config: Dict
    ) -> Dict:
        pixelized = self.pixelizer.pixelize(image, config["max_size"])
        reduced, reduced_palette = self.color_reducer.reduce(pixelized, config["max_colors"])

        matcher = PaletteMatcher(palette)
        grid_data = matcher.match(reduced_palette, reduced)["grid_data"]

        post_config = self.POST_PROCESS_CONFIGS.get(scheme_type, {})
        edge_mask = self._compute_edge_mask(
            reduced,
            edge_ratio_threshold=post_config.get("edge_ratio_threshold", DEFAULT_EDGE_RATIO_THRESHOLD),
        )

        processed_grid = self._clean_isolated_pixels(
            grid_data=grid_data,
            palette=palette,
            isolate_support_threshold=post_config.get("isolate_support_threshold", 1),
            edge_mask=edge_mask,
            edge_protect_delta_e=post_config.get("edge_protect_delta_e", DEFAULT_EDGE_PROTECT_DELTA_E),
        )

        processed_grid = self._merge_small_regions(
            grid_data=processed_grid,
            palette=palette,
            min_region_size=post_config.get("merge_min_region_size", 1),
            merge_delta_e=post_config.get("merge_delta_e", 8.0),
            edge_mask=edge_mask,
            edge_protect_delta_e=post_config.get("edge_protect_delta_e", DEFAULT_EDGE_PROTECT_DELTA_E),
        )

        if post_config.get("auto_remove_background", False):
            processed_grid = self._auto_remove_background(processed_grid)

        color_summary = self._build_color_summary(processed_grid, palette)
        total_beads = sum(c["count"] for c in color_summary)

        return {
            "type": scheme_type,
            "label": {"simple": "简单版", "standard": "标准版", "fine": "精细版"}[scheme_type],
            "tag": {"simple": "推荐新手", "standard": "推荐", "fine": "效果最佳"}[scheme_type],
            "grid_width": len(processed_grid[0]) if processed_grid else 0,
            "grid_height": len(processed_grid),
            "grid_data": processed_grid,
            "color_count": len(color_summary),
            "total_beads": total_beads,
            "color_summary": color_summary,
            "board_count": 1,
            "estimated_time": self._estimate_time(total_beads),
            "difficulty": self._calc_difficulty(len(color_summary), total_beads),
            "preview_url": self._generate_preview(reduced),
        }

    def _compute_edge_mask(self, image: np.ndarray, edge_ratio_threshold: float) -> List[List[bool]]:
        """根据局部梯度强度生成边缘保护掩码"""
        h, w = image.shape[:2]
        if h == 0 or w == 0:
            return []

        edge_mask = [[False] * w for _ in range(h)]
        threshold_value = max(1.0, edge_ratio_threshold * 765.0)

        for y in range(h):
            for x in range(w):
                current = image[y, x].astype(np.int32)
                strength = 0
                count = 0

                if x + 1 < w:
                    right = image[y, x + 1].astype(np.int32)
                    strength += int(np.abs(current - right).sum())
                    count += 1
                if y + 1 < h:
                    down = image[y + 1, x].astype(np.int32)
                    strength += int(np.abs(current - down).sum())
                    count += 1

                avg_strength = (strength / count) if count else 0.0
                if avg_strength >= threshold_value:
                    edge_mask[y][x] = True

        return edge_mask

    def _build_color_summary(self, grid_data: List[List[str]], palette: List[Dict]) -> List[Dict]:
        palette_map = {c["id"]: c for c in palette}
        color_counts: Dict[str, int] = {}

        for row in grid_data:
            for color_id in row:
                if color_id == "ERASE":
                    continue
                color_counts[color_id] = color_counts.get(color_id, 0) + 1

        color_summary = []
        for color_id, count in color_counts.items():
            p = palette_map.get(color_id)
            if not p:
                continue
            color_summary.append(
                {
                    "color_id": color_id,
                    "color_name": p.get("name", color_id),
                    "rgb": p.get("rgb", [0, 0, 0]),
                    "hex": p.get("hex", "#000000"),
                    "count": count,
                }
            )

        color_summary.sort(key=lambda x: x["count"], reverse=True)
        return color_summary

    def _clean_isolated_pixels(
        self,
        grid_data: List[List[str]],
        palette: List[Dict],
        isolate_support_threshold: int,
        edge_mask: List[List[bool]],
        edge_protect_delta_e: float,
    ) -> List[List[str]]:
        """孤立点清理：8邻域同色支持度太低时替换为邻域主色（含边缘保护）"""
        if isolate_support_threshold < 0 or not grid_data or not grid_data[0]:
            return [row[:] for row in grid_data]

        out = [row[:] for row in grid_data]
        h, w = len(out), len(out[0])
        matcher = PaletteMatcher(palette)
        palette_map = {c["id"]: c for c in palette}

        dirs8 = [
            (-1, -1), (-1, 0), (-1, 1),
            (0, -1),           (0, 1),
            (1, -1),  (1, 0),  (1, 1),
        ]

        for r in range(h):
            for c in range(w):
                center = out[r][c]
                if center == "ERASE":
                    continue

                same_support = 0
                neighbor_count: Dict[str, int] = {}
                for dr, dc in dirs8:
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nr >= h or nc < 0 or nc >= w:
                        continue
                    n_key = out[nr][nc]
                    if n_key == "ERASE":
                        continue
                    if n_key == center:
                        same_support += 1
                    else:
                        neighbor_count[n_key] = neighbor_count.get(n_key, 0) + 1

                if same_support > isolate_support_threshold or not neighbor_count:
                    continue

                candidate = max(neighbor_count, key=neighbor_count.get)

                if edge_mask and edge_mask[r][c]:
                    src_rgb = palette_map.get(center, {}).get("rgb")
                    dst_rgb = palette_map.get(candidate, {}).get("rgb")
                    if src_rgb and dst_rgb:
                        src_lab = np.array(matcher._rgb_to_lab(np.array(src_rgb, dtype=np.float64)))
                        dst_lab = np.array(matcher._rgb_to_lab(np.array(dst_rgb, dtype=np.float64)))
                        if matcher._delta_e2000(src_lab, dst_lab) > edge_protect_delta_e:
                            continue

                out[r][c] = candidate

        return out

    def _merge_small_regions(
        self,
        grid_data: List[List[str]],
        palette: List[Dict],
        min_region_size: int,
        merge_delta_e: float,
        edge_mask: List[List[bool]],
        edge_protect_delta_e: float,
    ) -> List[List[str]]:
        """小连通域合并：面积小于阈值时并入相邻且色差较小的区域（含边缘保护）"""
        if not grid_data or not grid_data[0] or min_region_size <= 1:
            return [row[:] for row in grid_data]

        out = [row[:] for row in grid_data]
        h, w = len(out), len(out[0])
        visited = [[False] * w for _ in range(h)]
        dirs4 = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        matcher = PaletteMatcher(palette)
        palette_map = {c["id"]: c for c in palette}

        for r in range(h):
            for c in range(w):
                if visited[r][c]:
                    continue

                target = out[r][c]
                if target == "ERASE":
                    visited[r][c] = True
                    continue

                stack = [(r, c)]
                visited[r][c] = True
                region: List[Tuple[int, int]] = []

                while stack:
                    cr, cc = stack.pop()
                    region.append((cr, cc))
                    for dr, dc in dirs4:
                        nr, nc = cr + dr, cc + dc
                        if nr < 0 or nr >= h or nc < 0 or nc >= w or visited[nr][nc]:
                            continue
                        if out[nr][nc] != target:
                            continue
                        visited[nr][nc] = True
                        stack.append((nr, nc))

                if len(region) >= min_region_size:
                    continue

                if self._is_region_edge_protected(region, edge_mask):
                    continue

                neighbor_count: Dict[str, int] = {}
                for rr, cc in region:
                    for dr, dc in dirs4:
                        nr, nc = rr + dr, cc + dc
                        if nr < 0 or nr >= h or nc < 0 or nc >= w:
                            continue
                        n_key = out[nr][nc]
                        if n_key == "ERASE" or n_key == target:
                            continue
                        neighbor_count[n_key] = neighbor_count.get(n_key, 0) + 1

                if not neighbor_count:
                    continue

                source_rgb = palette_map.get(target, {}).get("rgb")
                if not source_rgb:
                    continue
                source_lab = np.array(matcher._rgb_to_lab(np.array(source_rgb, dtype=np.float64)))

                best_key = None
                best_score = -1e9

                for n_key, freq in neighbor_count.items():
                    n_rgb = palette_map.get(n_key, {}).get("rgb")
                    if not n_rgb:
                        continue
                    n_lab = np.array(matcher._rgb_to_lab(np.array(n_rgb, dtype=np.float64)))
                    delta_e = matcher._delta_e2000(source_lab, n_lab)
                    if delta_e > merge_delta_e:
                        continue

                    score = freq * 10 - delta_e
                    if score > best_score:
                        best_score = score
                        best_key = n_key

                if not best_key:
                    continue

                edge_blocked = False
                for rr, cc in region:
                    if edge_mask and edge_mask[rr][cc]:
                        src_rgb = palette_map.get(target, {}).get("rgb")
                        dst_rgb = palette_map.get(best_key, {}).get("rgb")
                        if src_rgb and dst_rgb:
                            src_lab = np.array(matcher._rgb_to_lab(np.array(src_rgb, dtype=np.float64)))
                            dst_lab = np.array(matcher._rgb_to_lab(np.array(dst_rgb, dtype=np.float64)))
                            if matcher._delta_e2000(src_lab, dst_lab) > edge_protect_delta_e:
                                edge_blocked = True
                                break

                if edge_blocked:
                    continue

                for rr, cc in region:
                    out[rr][cc] = best_key

        return out

    @staticmethod
    def _is_region_edge_protected(region: List[Tuple[int, int]], edge_mask: List[List[bool]]) -> bool:
        if not edge_mask:
            return False
        edge_points = sum(1 for r, c in region if edge_mask[r][c])
        return edge_points / max(1, len(region)) >= 0.5

    def _auto_remove_background(self, grid_data: List[List[str]]) -> List[List[str]]:
        if not grid_data or not grid_data[0]:
            return [row[:] for row in grid_data]

        out = [row[:] for row in grid_data]
        h, w = len(out), len(out[0])
        border_counts: Dict[str, int] = {}

        def count_border(r: int, c: int):
            key = out[r][c]
            if key == "ERASE":
                return
            border_counts[key] = border_counts.get(key, 0) + 1

        for col in range(w):
            count_border(0, col)
            if h > 1:
                count_border(h - 1, col)

        for row in range(1, h - 1):
            count_border(row, 0)
            if w > 1:
                count_border(row, w - 1)

        if not border_counts:
            return out

        bg_key = max(border_counts, key=border_counts.get)

        visited = [[False] * w for _ in range(h)]
        stack: List[Tuple[int, int]] = []

        def push(r: int, c: int):
            if r < 0 or r >= h or c < 0 or c >= w or visited[r][c]:
                return
            if out[r][c] != bg_key:
                return
            visited[r][c] = True
            stack.append((r, c))

        for col in range(w):
            push(0, col)
            if h > 1:
                push(h - 1, col)

        for row in range(1, h - 1):
            push(row, 0)
            if w > 1:
                push(row, w - 1)

        while stack:
            r, c = stack.pop()
            out[r][c] = "ERASE"
            push(r + 1, c)
            push(r - 1, c)
            push(r, c + 1)
            push(r, c - 1)

        return out

    @staticmethod
    def _estimate_time(total_beads: int) -> int:
        return max(10, round(total_beads / 15))

    @staticmethod
    def _calc_difficulty(color_count: int, total_beads: int) -> str:
        if color_count <= 8 and total_beads <= 400:
            return "easy"
        if color_count <= 18 and total_beads <= 1500:
            return "medium"
        return "hard"

    @staticmethod
    def _generate_preview(image: np.ndarray) -> str:
        _ = image
        return "https://placeholder.com/preview.png"

    @staticmethod
    def evaluate_suitability(image: np.ndarray) -> Dict:
        pixels = image.reshape(-1, 3)
        unique_colors = len(np.unique(pixels, axis=0))

        if unique_colors < 1000:
            return {"score": 5, "hint": "这张图颜色简洁，非常适合做拼豆"}
        if unique_colors < 5000:
            return {"score": 4, "hint": "这张图主体突出，适合做拼豆"}
        if unique_colors < 20000:
            return {"score": 3, "hint": "这张图细节适中，建议选择标准版或简单版"}
        if unique_colors < 50000:
            return {"score": 2, "hint": "这张图细节较多，简单版可能丢失部分内容"}
        return {"score": 1, "hint": "这张图非常复杂，建议更换主体更突出的图"}
