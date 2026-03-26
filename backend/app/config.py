from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "拼豆豆助手 API"
    VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # File Upload
    MAX_UPLOAD_SIZE: int = 20971520  # 20MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png"]

    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALGORITHM: str = "HS256"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    CONVERT_RATE_LIMIT_PER_HOUR: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
