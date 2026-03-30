"""
转换服务层 - 处理图片上传和转换业务逻辑
"""
import io
import uuid
import numpy as np
from PIL import Image
from typing import Dict, List, BinaryIO
from app.engine.scheme_generator import SchemeGenerator
from app.core.cache import cache_client


class ConvertService:
    """转换服务"""

    def __init__(self):
        self.generator = SchemeGenerator()
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.allowed_formats = {"JPEG", "PNG", "JPG", "WEBP"}

    async def upload_image(self, file: BinaryIO, filename: str) -> Dict:
        """
        上传并验证图片

        Args:
            file: 文件对象
            filename: 文件名

        Returns:
            包含 image_id, width, height, size 的字典

        Raises:
            ValueError: 文件格式或大小不符合要求
        """
        # 读取文件内容
        content = await file.read()
        file_size = len(content)

        # 验证文件大小
        if file_size > self.max_file_size:
            raise ValueError(f"文件大小超过限制 ({self.max_file_size / 1024 / 1024}MB)")

        # 验证图片格式
        try:
            image = Image.open(io.BytesIO(content))
            if image.format not in self.allowed_formats:
                raise ValueError(f"不支持的图片格式: {image.format}")
        except Exception as e:
            raise ValueError(f"无效的图片文件: {str(e)}")

        # 转换为 RGB 模式
        if image.mode != "RGB":
            image = image.convert("RGB")

        # 生成唯一 ID
        image_id = str(uuid.uuid4())

        # 缓存图片数据到 Redis (1小时过期)
        image_array = np.array(image)
        await cache_client.set(
            f"image:{image_id}",
            image_array.tobytes(),
            expire=3600
        )

        # 缓存图片元数据
        await cache_client.set(
            f"image_meta:{image_id}",
            {
                "width": image.width,
                "height": image.height,
                "shape": image_array.shape,
                "size": file_size,
                "filename": filename
            },
            expire=3600
        )

        return {
            "image_id": image_id,
            "width": image.width,
            "height": image.height,
            "size": file_size
        }

    async def generate_schemes(
        self,
        image_id: str,
        palette: List[Dict]
    ) -> Dict:
        """
        生成三个转换方案

        Args:
            image_id: 图片ID
            palette: 色板数据

        Returns:
            包含 schemes 和 suitability 的字典
        """
        # 从缓存获取图片数据
        image_bytes = await cache_client.get(f"image:{image_id}")
        image_meta = await cache_client.get(f"image_meta:{image_id}")

        if not image_bytes or not image_meta:
            raise ValueError("图片不存在或已过期，请重新上传")

        # 重建 numpy 数组
        shape = image_meta["shape"]
        image_array = np.frombuffer(image_bytes, dtype=np.uint8).reshape(shape)

        # 生成三个方案
        schemes = self.generator.generate(image_array, palette)

        # 评估适合度
        suitability = self.generator.evaluate_suitability(image_array)

        return {
            "schemes": schemes,
            "suitability": suitability
        }

    async def get_cached_image(self, image_id: str) -> Dict:
        """获取缓存的图片元数据"""
        meta = await cache_client.get(f"image_meta:{image_id}")
        if not meta:
            raise ValueError("图片不存在或已过期")
        return meta
