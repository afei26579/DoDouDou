"""
简化版转图引擎 - 色板匹配模块
使用欧氏距离进行简单的颜色匹配
"""
import numpy as np
from typing import Dict, List


class PaletteMatcher:
    """将减色后的颜色映射到实际豆子色板"""

    def __init__(self, palette_colors: List[Dict]):
        """
        Args:
            palette_colors: 色板颜色列表
                [{"id": "C01", "rgb": [255,255,255], "name": "白色"}, ...]
        """
        self.palette = palette_colors
        self.palette_rgb = np.array([c["rgb"] for c in palette_colors])
        self.palette_ids = [c["id"] for c in palette_colors]

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
                "color_summary": [...]       # 颜色统计
            }
        """
        h, w = image.shape[:2]

        # 为每个减色色板颜色找到最近的豆子色板颜色
        color_mapping = {}
        used_palette_ids = set()

        for i, reduced_color in enumerate(reduced_palette):
            # 计算与所有色板颜色的欧氏距离
            distances = np.sqrt(np.sum((self.palette_rgb - reduced_color) ** 2, axis=1))

            # 找到最近的未使用的颜色
            sorted_indices = np.argsort(distances)
            for idx in sorted_indices:
                palette_id = self.palette_ids[idx]
                if palette_id not in used_palette_ids:
                    color_mapping[tuple(reduced_color)] = palette_id
                    used_palette_ids.add(palette_id)
                    break

        # 生成grid_data
        grid_data = []
        color_counts = {}

        for y in range(h):
            row = []
            for x in range(w):
                pixel = tuple(image[y, x])
                color_id = color_mapping.get(pixel, "C01")  # 默认白色
                row.append(color_id)

                # 统计颜色使用量
                if color_id not in color_counts:
                    color_counts[color_id] = 0
                color_counts[color_id] += 1

            grid_data.append(row)

        # 生成color_summary
        color_summary = []
        for color_id, count in color_counts.items():
            # 找到对应的色板信息
            palette_info = next((c for c in self.palette if c["id"] == color_id), None)
            if palette_info:
                color_summary.append({
                    "color_id": color_id,
                    "color_name": palette_info.get("name", color_id),
                    "hex": palette_info.get("hex", "#000000"),
                    "count": count,
                })

        # 按使用量排序
        color_summary.sort(key=lambda x: x["count"], reverse=True)

        return {
            "grid_data": {"format": "2d_array", "data": grid_data},
            "color_summary": color_summary,
        }
