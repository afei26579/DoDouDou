"""
转换相关 API 端点
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import Optional
from app.schemas.convert import (
    ImageUploadResponse,
    ConvertResponse,
    SchemeResponse
)
from app.services.convert_service import ConvertService
from app.core.deps import get_current_user_optional
from app.models.models import User

router = APIRouter(prefix="/convert", tags=["convert"])


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    上传图片

    - 支持格式: JPEG, PNG, WEBP
    - 最大文件大小: 10MB
    - 返回图片ID用于后续转换
    """
    service = ConvertService()

    try:
        result = await service.upload_image(file.file, file.filename)
        return ImageUploadResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"上传失败: {str(e)}")


@router.post("/generate", response_model=ConvertResponse)
async def generate_schemes(
    image_id: str,
    palette_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    生成三个转换方案

    - image_id: 上传图片返回的ID
    - palette_id: 色板ID (可选，默认使用 Artkal)
    - 返回 simple/standard/fine 三个方案
    """
    service = ConvertService()

    # TODO: 从数据库加载色板数据
    # 暂时使用硬编码的 Artkal 色板
    from app.data.artkal_palette import get_artkal_palette
    palette = get_artkal_palette()

    try:
        result = await service.generate_schemes(image_id, palette)
        return ConvertResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"转换失败: {str(e)}")
