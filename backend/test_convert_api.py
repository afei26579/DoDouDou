"""
测试图片转换 API
"""
import requests
import io
from PIL import Image
import numpy as np

# API 基础 URL
BASE_URL = "http://localhost:8000/api/v1"


def create_test_image():
    """创建一个简单的测试图片"""
    # 创建一个 100x100 的彩色渐变图
    img_array = np.zeros((100, 100, 3), dtype=np.uint8)
    for i in range(100):
        for j in range(100):
            img_array[i, j] = [i * 2, j * 2, (i + j) % 256]

    img = Image.fromarray(img_array)

    # 转换为字节流
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)

    return img_bytes


def test_upload_and_convert():
    """测试上传和转换流程"""
    print("=" * 50)
    print("测试图片上传和转换 API")
    print("=" * 50)

    # Step 1: 上传图片
    print("\n1. 上传测试图片...")
    test_image = create_test_image()

    files = {
        'file': ('test.png', test_image, 'image/png')
    }

    response = requests.post(f"{BASE_URL}/convert/upload", files=files)

    if response.status_code != 200:
        print(f"❌ 上传失败: {response.status_code}")
        print(response.json())
        return

    upload_result = response.json()
    print(f"✅ 上传成功!")
    print(f"   图片ID: {upload_result['image_id']}")
    print(f"   尺寸: {upload_result['width']}x{upload_result['height']}")
    print(f"   大小: {upload_result['size']} bytes")

    # Step 2: 生成转换方案
    print("\n2. 生成转换方案...")
    image_id = upload_result['image_id']

    response = requests.post(
        f"{BASE_URL}/convert/generate",
        params={"image_id": image_id}
    )

    if response.status_code != 200:
        print(f"❌ 转换失败: {response.status_code}")
        print(response.json())
        return

    convert_result = response.json()
    print(f"✅ 转换成功!")

    # 显示适合度评估
    suitability = convert_result['suitability']
    print(f"\n适合度评估:")
    print(f"   评分: {suitability['score']}/5")
    print(f"   提示: {suitability['hint']}")

    # 显示三个方案
    print(f"\n生成的方案:")
    for scheme in convert_result['schemes']:
        print(f"\n   【{scheme['label']}】 {scheme['tag']}")
        print(f"   - 网格尺寸: {scheme['grid_width']}x{scheme['grid_height']}")
        print(f"   - 颜色数量: {scheme['color_count']}")
        print(f"   - 珠子总数: {scheme['total_beads']}")
        print(f"   - 难度: {scheme['difficulty']}")
        print(f"   - 预计时间: {scheme['estimated_time']}分钟")
        print(f"   - 颜色统计: {len(scheme['color_summary'])} 种颜色")

    print("\n" + "=" * 50)
    print("测试完成!")
    print("=" * 50)


if __name__ == "__main__":
    try:
        test_upload_and_convert()
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到后端服务器")
        print("请确保后端服务器正在运行: uvicorn app.main:app --reload")
    except Exception as e:
        print(f"❌ 测试失败: {str(e)}")
        import traceback
        traceback.print_exc()
