"""
转换相关的 Pydantic schemas
"""
from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class ColorSummaryItem(BaseModel):
    """颜色统计项"""
    color_id: str = Field(..., description="色号")
    color_name: str = Field(..., description="颜色名称")
    rgb: List[int] = Field(..., description="RGB值")
    hex: str = Field(..., description="十六进制颜色")
    count: int = Field(..., description="珠子数量")


class SchemeResponse(BaseModel):
    """单个方案响应"""
    type: str = Field(..., description="方案类型: simple/standard/fine")
    label: str = Field(..., description="方案标签")
    tag: str = Field(..., description="推荐标签")
    grid_width: int = Field(..., description="网格宽度")
    grid_height: int = Field(..., description="网格高度")
    grid_data: List[List[str]] = Field(..., description="网格数据 (2D数组)")
    color_count: int = Field(..., description="颜色数量")
    total_beads: int = Field(..., description="总珠子数")
    color_summary: List[ColorSummaryItem] = Field(..., description="颜色统计")
    board_count: int = Field(..., description="板子数量")
    estimated_time: int = Field(..., description="预计时间(分钟)")
    difficulty: str = Field(..., description="难度: easy/medium/hard")
    preview_url: str = Field(..., description="预览图URL")


class ConvertResponse(BaseModel):
    """转换响应"""
    schemes: List[SchemeResponse] = Field(..., description="三个方案")
    suitability: Dict = Field(..., description="适合度评估")


class ImageUploadResponse(BaseModel):
    """图片上传响应"""
    image_id: str = Field(..., description="图片ID")
    width: int = Field(..., description="原始宽度")
    height: int = Field(..., description="原始高度")
    size: int = Field(..., description="文件大小(字节)")
