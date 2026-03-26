"""
测试后端基础功能
"""
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """测试核心模块导入"""
    print("测试模块导入...")

    try:
        from app.config import settings
        print("✓ 配置模块导入成功")
    except Exception as e:
        print(f"✗ 配置模块导入失败: {e}")
        return False

    try:
        from app.models import User, Work, ColorPalette, Template
        print("✓ 数据模型导入成功")
    except Exception as e:
        print(f"✗ 数据模型导入失败: {e}")
        return False

    try:
        from app.engine import SchemeGenerator
        print("✓ 转图引擎导入成功")
    except Exception as e:
        print(f"✗ 转图引擎导入失败: {e}")
        return False

    try:
        from app.core import create_access_token
        print("✓ 认证模块导入成功")
    except Exception as e:
        print(f"✗ 认证模块导入失败: {e}")
        return False

    return True

def test_engine():
    """测试转图引擎基础功能"""
    print("\n测试转图引擎...")

    try:
        import numpy as np
        from app.engine import Pixelizer, ColorReducer

        # 创建测试图片
        test_image = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)

        # 测试像素化
        pixelizer = Pixelizer()
        pixelized = pixelizer.pixelize(test_image, 29)
        print(f"✓ 像素化成功: {pixelized.shape}")

        # 测试减色
        reducer = ColorReducer()
        reduced, palette = reducer.reduce(pixelized, 15)
        print(f"✓ 减色成功: 生成{len(palette)}种颜色")

        return True
    except Exception as e:
        print(f"✗ 转图引擎测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 50)
    print("拼豆豆助手后端测试")
    print("=" * 50)

    # 测试导入
    if not test_imports():
        print("\n❌ 模块导入测试失败")
        return False

    # 测试引擎
    if not test_engine():
        print("\n❌ 转图引擎测试失败")
        return False

    print("\n" + "=" * 50)
    print("✅ 所有测试通过！")
    print("=" * 50)
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
