"""
简化版转图引擎 - 减色模块
使用K-means聚类进行颜色量化
"""
import numpy as np
from sklearn.cluster import KMeans
from typing import Tuple


class ColorReducer:
    """智能减色：将图片颜色减少到指定数量"""

    def reduce(
        self,
        image: np.ndarray,
        target_colors: int,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        减色处理

        Args:
            image: 输入RGB图片 (H, W, 3), 0-255
            target_colors: 目标颜色数

        Returns:
            (reduced_image, palette)
            reduced_image: 减色后的图片 (H, W, 3)
            palette: 减色色板 (N, 3) RGB
        """
        h, w = image.shape[:2]

        # 展平为像素列表
        pixels = image.reshape(-1, 3).astype(np.float32)

        # K-means 聚类
        kmeans = KMeans(
            n_clusters=target_colors,
            n_init=10,
            max_iter=300,
            random_state=42
        )
        labels = kmeans.fit_predict(pixels)
        centers = kmeans.cluster_centers_

        # 转回 RGB uint8
        centers_rgb = centers.clip(0, 255).astype(np.uint8)

        # 用聚类中心重建图片
        reduced_pixels = centers_rgb[labels]
        reduced_image = reduced_pixels.reshape(h, w, 3)

        return reduced_image, centers_rgb
