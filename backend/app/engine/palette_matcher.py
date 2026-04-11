"""
转图引擎 - 色板匹配模块
使用 CIELAB + CIEDE2000 进行更符合人眼感知的颜色匹配
"""
import math
import numpy as np
from typing import Dict, List, Tuple


class PaletteMatcher:
    """将减色后的颜色映射到实际豆子色板"""

    def __init__(self, palette_colors: List[Dict]):
        """
        Args:
            palette_colors: 色板颜色列表
                [{"id": "C01", "rgb": [255,255,255], "name": "白色", "hex": "#FFFFFF"}, ...]
        """
        self.palette = palette_colors
        self.palette_rgb = np.array([c["rgb"] for c in palette_colors], dtype=np.float64)
        self.palette_ids = [c["id"] for c in palette_colors]
        self.palette_lab = np.array([self._rgb_to_lab(rgb) for rgb in self.palette_rgb], dtype=np.float64)

    @staticmethod
    def _srgb_to_linear(v: float) -> float:
        x = v / 255.0
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4

    @classmethod
    def _rgb_to_lab(cls, rgb: np.ndarray) -> Tuple[float, float, float]:
        r = cls._srgb_to_linear(float(rgb[0]))
        g = cls._srgb_to_linear(float(rgb[1]))
        b = cls._srgb_to_linear(float(rgb[2]))

        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

        def f(t: float) -> float:
            return t ** (1 / 3) if t > 0.008856 else (7.787 * t + 16 / 116)

        fx = f(x)
        fy = f(y)
        fz = f(z)

        l = 116 * fy - 16
        a = 500 * (fx - fy)
        b_val = 200 * (fy - fz)
        return l, a, b_val

    @staticmethod
    def _delta_e2000(lab1: np.ndarray, lab2: np.ndarray) -> float:
        l1, a1, b1 = float(lab1[0]), float(lab1[1]), float(lab1[2])
        l2, a2, b2 = float(lab2[0]), float(lab2[1]), float(lab2[2])

        k_l = 1.0
        k_c = 1.0
        k_h = 1.0

        c1 = math.sqrt(a1 * a1 + b1 * b1)
        c2 = math.sqrt(a2 * a2 + b2 * b2)
        c_bar = (c1 + c2) / 2.0

        g = 0.5 * (1 - math.sqrt((c_bar ** 7) / (c_bar ** 7 + 25 ** 7 + 1e-12)))

        a1p = (1 + g) * a1
        a2p = (1 + g) * a2

        c1p = math.sqrt(a1p * a1p + b1 * b1)
        c2p = math.sqrt(a2p * a2p + b2 * b2)

        h1p = math.degrees(math.atan2(b1, a1p)) % 360
        h2p = math.degrees(math.atan2(b2, a2p)) % 360

        d_lp = l2 - l1
        d_cp = c2p - c1p

        d_hp = 0.0
        if c1p * c2p != 0:
            diff = h2p - h1p
            if abs(diff) <= 180:
                d_hp = diff
            elif diff > 180:
                d_hp = diff - 360
            else:
                d_hp = diff + 360

        d_hp_term = 2 * math.sqrt(c1p * c2p) * math.sin(math.radians(d_hp / 2))

        l_bar_p = (l1 + l2) / 2
        c_bar_p = (c1p + c2p) / 2

        if c1p * c2p == 0:
            h_bar_p = h1p + h2p
        else:
            if abs(h1p - h2p) > 180:
                h_bar_p = (h1p + h2p + 360) / 2
            else:
                h_bar_p = (h1p + h2p) / 2

        t = (
            1
            - 0.17 * math.cos(math.radians(h_bar_p - 30))
            + 0.24 * math.cos(math.radians(2 * h_bar_p))
            + 0.32 * math.cos(math.radians(3 * h_bar_p + 6))
            - 0.20 * math.cos(math.radians(4 * h_bar_p - 63))
        )

        d_theta = 30 * math.exp(-(((h_bar_p - 275) / 25) ** 2))
        r_c = 2 * math.sqrt((c_bar_p ** 7) / (c_bar_p ** 7 + 25 ** 7 + 1e-12))

        s_l = 1 + (0.015 * ((l_bar_p - 50) ** 2)) / math.sqrt(20 + ((l_bar_p - 50) ** 2))
        s_c = 1 + 0.045 * c_bar_p
        s_h = 1 + 0.015 * c_bar_p * t

        r_t = -math.sin(math.radians(2 * d_theta)) * r_c

        return math.sqrt(
            (d_lp / (k_l * s_l)) ** 2
            + (d_cp / (k_c * s_c)) ** 2
            + (d_hp_term / (k_h * s_h)) ** 2
            + r_t * (d_cp / (k_c * s_c)) * (d_hp_term / (k_h * s_h))
        )

    def _nearest_palette_idx(self, reduced_color: np.ndarray) -> int:
        target_lab = np.array(self._rgb_to_lab(reduced_color), dtype=np.float64)
        best_idx = 0
        best_dist = float("inf")

        for i in range(len(self.palette_lab)):
            dist = self._delta_e2000(target_lab, self.palette_lab[i])
            if dist < best_dist:
                best_dist = dist
                best_idx = i

        return best_idx

    def match(
        self,
        reduced_palette: np.ndarray,
        image: np.ndarray,
    ) -> Dict:
        """
        将减色色板映射到豆子色板

        Args:
            reduced_palette: 减色后的色板 (N, 3) RGB
            image: 减色后的图片 (H, W, 3)

        Returns:
            {
                "grid_data": [[...], ...],  # 最终图稿，每格是色板ID
                "color_summary": [...]      # 颜色统计
            }
        """
        h, w = image.shape[:2]

        # 为每个减色中心找到最接近的豆子色板颜色（允许多个中心映射到同一色号）
        color_mapping: Dict[Tuple[int, int, int], str] = {}
        for reduced_color in reduced_palette:
            center = tuple(int(v) for v in reduced_color)
            best_idx = self._nearest_palette_idx(np.array(center, dtype=np.float64))
            color_mapping[center] = self.palette_ids[best_idx]

        # 生成 grid_data + 颜色计数
        grid_data: List[List[str]] = []
        color_counts: Dict[str, int] = {}

        for y in range(h):
            row: List[str] = []
            for x in range(w):
                pixel = tuple(int(v) for v in image[y, x])
                color_id = color_mapping.get(pixel, self.palette_ids[0])
                row.append(color_id)
                color_counts[color_id] = color_counts.get(color_id, 0) + 1
            grid_data.append(row)

        # 生成 color_summary
        palette_map = {c["id"]: c for c in self.palette}
        color_summary = []
        for color_id, count in color_counts.items():
            palette_info = palette_map.get(color_id)
            if not palette_info:
                continue
            color_summary.append({
                "color_id": color_id,
                "color_name": palette_info.get("name", color_id),
                "rgb": palette_info.get("rgb", [0, 0, 0]),
                "hex": palette_info.get("hex", "#000000"),
                "count": count,
            })

        color_summary.sort(key=lambda x: x["count"], reverse=True)

        return {
            "grid_data": grid_data,
            "color_summary": color_summary,
        }
