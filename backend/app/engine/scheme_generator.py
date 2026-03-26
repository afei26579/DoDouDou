"""
简化版转图引擎 - 主控模块
协调各模块完成端到端转图
"""
import numpy as np
from PIL import Image
from typing import Dict, List
from app.engine.pixelizer import Pixelizer
from app.engine.color_reducer import ColorReducer
from app.engine.palette_matcher import PaletteMatcher


class SchemeGenerator:
    """三方案生成器：协调各模块完成端到端转图"""

    def __init__(self):
        self.pixelizer = Pixelizer()
        self.color_reducer = ColorReducer()

    def generate(
        self,
        image: np.ndarray,
        palette: List[Dict],
    ) -> List[Dict]:
        """
        生成三种方案

        Args:
            image: 输入图片 RGB numpy数组
            palette: 色板数据

        Returns:
            包含 simple/standard/fine 三个方案的列表
        """
        schemes = []

        # 对每种方案执行完整流程
        for scheme_type, config in Pixelizer.SCHEME_CONFIGS.items():
            scheme = self._generate_single_scheme(
                image, palette, scheme_type, config
            )
            schemes.append(scheme)

        return schemes

    def _generate_single_scheme(
        self, image: np.ndarray, palette: List[Dict], scheme_type: str, config: Dict
    ) -> Dict:
        """生成单个方案"""
        # Step 1: 像素化
        pixelized = self.pixelizer.pixelize(image, config["max_size"])

        # Step 2: 减色
        reduced, reduced_palette = self.color_reducer.reduce(
            pixelized, config["max_colors"]
        )

        # Step 3: 色板匹配
        matcher = PaletteMatcher(palette)
        match_result = matcher.match(reduced_palette, reduced)

        grid_data = match_result["grid_data"]
        color_summary = match_result["color_summary"]

        # Step 4: 统计
        grid_h, grid_w = pixelized.shape[0], pixelized.shape[1]
        total_beads = sum(c["count"] for c in color_summary)

        # Step 5: 计算难度和预计时间
        difficulty = self._calc_difficulty(len(color_summary), total_beads)
        estimated_time = self._estimate_time(total_beads)

        # Step 6: 生成预览图 (简化版：直接使用reduced图片)
        preview_url = self._generate_preview(reduced)

        return {
            "type": scheme_type,
            "label": {"simple": "简单版", "standard": "标准版", "fine": "精细版"}[scheme_type],
            "tag": {"simple": "推荐新手", "standard": "推荐", "fine": "效果最佳"}[scheme_type],
            "grid_width": grid_w,
            "grid_height": grid_h,
            "grid_data": grid_data,
            "color_count": len(color_summary),
            "total_beads": total_beads,
            "color_summary": color_summary,
            "board_count": 1,  # 简化版暂不支持大图拆板
            "estimated_time": estimated_time,
            "difficulty": difficulty,
            "preview_url": preview_url,
        }

    def _estimate_time(self, total_beads: int) -> int:
        """估算制作时间(分钟)，经验值：约15颗/分钟"""
        return max(10, round(total_beads / 15))

    def _calc_difficulty(self, color_count: int, total_beads: int) -> str:
        """计算难度"""
        if color_count <= 8 and total_beads <= 400:
            return "easy"
        elif color_count <= 18 and total_beads <= 1500:
            return "medium"
        else:
            return "hard"

    def _generate_preview(self, image: np.ndarray) -> str:
        """生成预览图URL (简化版：返回占位符)"""
        # TODO: 实际应该将图片上传到OSS并返回URL
        return "https://placeholder.com/preview.png"

    def evaluate_suitability(self, image: np.ndarray) -> Dict:
        """评估图片适合做拼豆的程度"""
        # 简化实现：统计颜色复杂度
        h, w = image.shape[:2]
        pixels = image.reshape(-1, 3)
        unique_colors = len(np.unique(pixels, axis=0))

        if unique_colors < 1000:
            score = 5
            hint = "这张图颜色简洁，非常适合做拼豆"
        elif unique_colors < 5000:
            score = 4
            hint = "这张图主体突出，适合做拼豆"
        elif unique_colors < 20000:
            score = 3
            hint = "这张图细节适中，建议选择标准版或简单版"
        elif unique_colors < 50000:
            score = 2
            hint = "这张图细节较多，简单版可能丢失部分内容"
        else:
            score = 1
            hint = "这张图非常复杂，建议更换主体更突出的图"

        return {"score": score, "hint": hint}
