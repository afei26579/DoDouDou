"""User service layer"""
from datetime import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import User
from app.core.security import get_password_hash, verify_password
import uuid


class UserService:
    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """Get user by email"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
        """Get user by ID"""
        result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
        return result.scalar_one_or_none()

    @staticmethod
    async def create_user(
        db: AsyncSession,
        email: str,
        password: str,
        nickname: Optional[str] = None,
        platform: str = "web"
    ) -> User:
        """Create new user"""
        user = User(
            id=uuid.uuid4(),
            email=email,
            password_hash=get_password_hash(password),
            nickname=nickname or email.split('@')[0],
            platform=platform,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def authenticate(
        db: AsyncSession,
        email: str,
        password: str
    ) -> Optional[User]:
        """Authenticate user"""
        user = await UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None

        # Update last login
        user.last_login_at = datetime.utcnow()
        await db.commit()
        return user

    @staticmethod
    async def update_last_login(db: AsyncSession, user_id: str) -> None:
        """Update user's last login time"""
        user = await UserService.get_by_id(db, user_id)
        if user:
            user.last_login_at = datetime.utcnow()
            await db.commit()
