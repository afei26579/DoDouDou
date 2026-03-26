from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


# User Schemas
class UserBase(BaseModel):
    nickname: Optional[str] = None
    email: Optional[EmailStr] = None


class UserCreate(UserBase):
    email: EmailStr
    password: str = Field(..., min_length=6)
    nickname: str = Field(..., min_length=1, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: UUID
    user_level: str
    plan: str
    plan_expires_at: Optional[datetime] = None
    created_at: datetime
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserPreferences(BaseModel):
    default_palette_id: Optional[UUID] = None
    default_board_size: str = "standard"
    unit: str = "cm"
    show_grid: bool = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: UUID
    exp: datetime


# Work Schemas
class WorkBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    source_type: str = Field(..., pattern="^(import|template)$")


class WorkCreate(WorkBase):
    template_id: Optional[UUID] = None
    grid_width: int = Field(..., gt=0)
    grid_height: int = Field(..., gt=0)
    grid_data: Dict[str, Any]
    palette_id: Optional[UUID] = None
    scheme_config: Dict[str, Any] = {}
    color_summary: List[Dict[str, Any]] = []
    total_beads: int = 0
    color_count: int = 0
    board_count: int = 1
    difficulty: str = "medium"
    estimated_time: int = 0


class WorkUpdate(BaseModel):
    name: Optional[str] = None
    grid_data: Optional[Dict[str, Any]] = None
    follow_state: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class WorkResponse(WorkBase):
    id: UUID
    user_id: UUID
    status: str
    grid_width: int
    grid_height: int
    palette_id: Optional[UUID]
    total_beads: int
    color_count: int
    board_count: int
    difficulty: str
    estimated_time: int
    color_summary: List[Dict[str, Any]]
    scheme_config: Dict[str, Any]
    follow_state: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Convert Schemas
class ConvertRequest(BaseModel):
    image_url: str
    palette_id: Optional[UUID] = None
    crop: Optional[Dict[str, int]] = None
    target_size: str = "standard"  # simple/standard/fine


class SchemeResponse(BaseModel):
    type: str
    label: str
    tag: str
    grid_width: int
    grid_height: int
    color_count: int
    total_beads: int
    board_count: int
    estimated_time: int
    difficulty: str
    preview_url: str
    grid_data: Dict[str, Any]
    color_summary: List[Dict[str, Any]]


class ConvertResponse(BaseModel):
    task_id: UUID
    status: str
    schemes: Optional[List[SchemeResponse]] = None
    suitability_score: Optional[int] = None
    suitability_hint: Optional[str] = None


# Palette Schemas
class ColorInfo(BaseModel):
    id: str
    name: str
    name_en: str
    hex: str
    rgb: List[int]
    lab: List[float]
    category: str
    available: bool = True


class PaletteResponse(BaseModel):
    id: UUID
    brand: str
    name: str
    version: Optional[str]
    colors: List[ColorInfo]
    color_count: int
    is_default: bool

    class Config:
        from_attributes = True


# Template Schemas
class TemplateResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    category: str
    tags: List[str]
    grid_width: int
    grid_height: int
    palette_id: Optional[UUID]
    total_beads: int
    color_count: int
    difficulty: str
    estimated_time: int
    preview_url: Optional[str]
    is_featured: bool
    is_starter: bool
    use_count: int
    favorite_count: int

    class Config:
        from_attributes = True


# Common Response
class MessageResponse(BaseModel):
    message: str
    code: int = 0


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    page_size: int
