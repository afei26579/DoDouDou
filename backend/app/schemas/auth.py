"""Authentication schemas"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    nickname: Optional[str] = Field(None, max_length=50)
    platform: str = Field(default="web")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    email: Optional[str]
    nickname: Optional[str]
    avatar_url: Optional[str]
    user_level: str
    plan: str
    platform: str
    created_at: str

    class Config:
        from_attributes = True
