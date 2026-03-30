"""
简化测试 - 直接测试转换引擎
"""
import numpy as np
from PIL import Image
from app.engine.scheme_generator import SchemeGenerator
from app.data.artkal_palette import get_artkal_palette


def create_test_image():
    """创建一个简单的测试图片"""
    # 创建一个 100x100 的彩色渐变图
    img_array = np.zeros((100, 100, 3), dtype=np.uint8)
    for i in range(100):
        for j in range(100):
            img_array[i, j] = [i * 2, j * 2, (i + j) % 256]

    return img_array


def test_engine():
    """测试转换引擎"""
    print("=" * 50)
    print("测试拼豆转换引擎")
    print("=" * 50)

    # 创建测试图片
    print("\n1. 创建测试图片...")
    image = create_test_image()
    print(f"   图片尺寸: {image.shape}")

    # 加载色板
    print("\n2. 加载 Artkal 色板...")
    palette = get_artkal_palette()
    print(f"   色板颜色数: {len(palette)}")

    # 生成方案
    print("\n3. 生成转换方案...")
    generator = SchemeGenerator()
    schemes = generator.generate(image, palette)

    print(f"   生成了 {len(schemes)} 个方案")

    # 评估适合度
    print("\n4. 评估适合度...")
    suitability = generator.evaluate_suitability(image)
    print(f"   评分: {suitability['score']}/5")
    print(f"   提示: {suitability['hint']}")

    # 显示方案详情
    print("\n5. 方案详情:")
    for scheme in schemes:
        print(f"\n   【{scheme['label']}】 {scheme['tag']}")
        print(f"   - 网格尺寸: {scheme['grid_width']}x{scheme['grid_height']}")
        print(f"   - 颜色数量: {scheme['color_count']}")
        print(f"   - 珠子总数: {scheme['total_beads']}")
        print(f"   - 难度: {scheme['difficulty']}")
        print(f"   - 预计时间: {scheme['estimated_time']}分钟")

        # 显示前5种颜色
        print(f"   - 颜色统计 (前5种):")
        for color in scheme['color_summary'][:5]:
            print(f"     * {color['color_id']} {color['color_name']}: {color['count']}颗")

    print("\n" + "=" * 50)
    print("测试完成!")
    print("=" * 50)


if __name__ == "__main__":
    try:
        test_engine()
    except Exception as e:
        print(f"测试失败: {str(e)}")
        import traceback
        traceback.print_exc()
