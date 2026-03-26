"""
简化版转图引擎 - 像素化模块
使用Pillow进行基础图像缩放
"""
import numpy as np
from PIL import Image
from typing import Tuple


class Pixelizer:
    """将图片像素化到目标网格尺寸"""

    # 三种方案的尺寸配置
    SCHEME_CONFIGS = {
        "simple": {"max_size": 15, "max_colors": 8},
        "standard": {"max_size": 29, "max_colors": 15},
        "fine": {"max_size": 58, "max_colors": 25},
    }

    def pixelize(
        self,
        image: np.ndarray,
        target_size: int,
        keep_aspect: bool = True
    ) -> np.ndarray:
        """
        将图片缩放到目标网格尺寸

        Args:
            image: 输入图片 RGB numpy数组 (H, W, 3)
            target_size: 目标短边像素数（即格数）
            keep_aspect: 是否保持宽高比

        Returns:
            缩放后的小图 (target_h, target_w, 3)
        """
        h, w = image.shape[:2]

        if keep_aspect:
            if h <= w:
                target_h = target_size
                target_w = round(target_size * w / h)
            else:
                target_w = target_size
                target_h = round(target_size * h / w)
        else:
            target_h = target_w = target_size

        # 使用 LANCZOS 插值缩放 (保留细节最好)
        pil_img = Image.fromarray(image)
        pil_img = pil_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

        return np.array(pil_img)

    def generate_schemes(self, image: np.ndarray) -> dict:
        """生成三种方案的像素化结果"""
        schemes = {}
        for scheme_type, config in self.SCHEME_CONFIGS.items():
            pixelized = self.pixelize(image, config["max_size"])
            schemes[scheme_type] = {
                "pixelized_image": pixelized,
                "max_colors": config["max_colors"],
                "grid_width": pixelized.shape[1],
                "grid_height": pixelized.shape[0],
            }
        return schemes
