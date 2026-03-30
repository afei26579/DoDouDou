"""
测试图片上传和转换流程
"""
import asyncio
import io
from PIL import Image
import numpy as np
from app.services.convert_service import ConvertService
from app.data.artkal_palette import get_artkal_palette
from app.core.cache import cache_client


async def test_convert():
    """测试转换流程"""
    # 初始化 Redis 连接
    print("Connecting to Redis...")
    await cache_client.connect()

    try:
        # 创建一个简单的测试图片 (红色方块)
        test_image = Image.new('RGB', (100, 100), color=(255, 0, 0))
        img_bytes = io.BytesIO()
        test_image.save(img_bytes, format='PNG')
        img_bytes.seek(0)

        service = ConvertService()

        # 测试上传
        print("Testing image upload...")
        # 模拟文件上传
        class MockFile:
            def __init__(self, content):
                self.content = content
                self.pos = 0

            async def read(self):
                return self.content

        mock_file = MockFile(img_bytes.getvalue())
        result = await service.upload_image(mock_file, "test.png")
        print(f"[OK] Upload successful: {result}")

        image_id = result["image_id"]

        # 测试转换
        print("\nTesting scheme generation...")
        palette = get_artkal_palette()
        convert_result = await service.generate_schemes(image_id, palette)

        print(f"[OK] Generated {len(convert_result['schemes'])} schemes")
        print(f"[OK] Suitability score: {convert_result['suitability']['score']}/5")

        # 打印每个方案的信息
        for scheme in convert_result['schemes']:
            print(f"\n{scheme['label']} ({scheme['type']}):")
            print(f"  - Grid: {scheme['grid_width']}x{scheme['grid_height']}")
            print(f"  - Colors: {scheme['color_count']}")
            print(f"  - Beads: {scheme['total_beads']}")
            print(f"  - Difficulty: {scheme['difficulty']}")
            print(f"  - Time: {scheme['estimated_time']} min")

        print("\n[OK] All tests passed!")

    except Exception as e:
        print(f"[ERROR] Test failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # 断开 Redis 连接
        await cache_client.disconnect()


if __name__ == "__main__":
    asyncio.run(test_convert())
