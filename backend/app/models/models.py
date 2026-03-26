import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Integer, JSON, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nickname = Column(String(50))
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    avatar_url = Column(String(500))

    # User level from onboarding
    user_level = Column(String(20), default="beginner")  # beginner/intermediate/advanced

    # Membership
    plan = Column(String(20), default="free")  # free/pro
    plan_expires_at = Column(DateTime, nullable=True)

    # Preferences
    preferences = Column(JSON, default={})

    # Usage statistics
    monthly_convert_count = Column(Integer, default=0)
    monthly_convert_reset = Column(DateTime)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)

    # Platform
    platform = Column(String(20), default="web")  # web/wechat_mp/douyin_mp/app
    platform_openid = Column(String(255), nullable=True)

    # Relationships
    works = relationship("Work", back_populates="user", cascade="all, delete-orphan")


class Work(Base):
    __tablename__ = "works"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Basic info
    name = Column(String(100), nullable=False)
    status = Column(String(20), default="draft")  # draft/in_progress/completed
    source_type = Column(String(20), nullable=False)  # import/template
    template_id = Column(UUID(as_uuid=True), nullable=True)

    # Grid data (core)
    grid_width = Column(Integer, nullable=False)
    grid_height = Column(Integer, nullable=False)
    grid_data = Column(JSON, nullable=False)
    palette_id = Column(UUID(as_uuid=True), nullable=True)

    # Scheme configuration
    scheme_config = Column(JSON, default={})

    # Statistics
    total_beads = Column(Integer, default=0)
    color_count = Column(Integer, default=0)
    board_count = Column(Integer, default=1)
    difficulty = Column(String(10), default="medium")  # easy/medium/hard
    estimated_time = Column(Integer, default=0)  # minutes

    # Color summary
    color_summary = Column(JSON, default=[])

    # Follow progress
    follow_state = Column(JSON, default={})

    # Board layout (for large images)
    board_layout = Column(JSON, nullable=True)

    # Completion info
    completed_at = Column(DateTime, nullable=True)
    actual_time = Column(Integer, nullable=True)  # minutes

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="works")


class ColorPalette(Base):
    __tablename__ = "color_palettes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand = Column(String(50), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    version = Column(String(20))

    # Color data
    colors = Column(JSON, nullable=False)
    color_count = Column(Integer, default=0)
    is_default = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Template(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Basic info
    name = Column(String(100), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False, index=True)
    tags = Column(JSON, default=[])

    # Grid data
    grid_width = Column(Integer, nullable=False)
    grid_height = Column(Integer, nullable=False)
    grid_data = Column(JSON, nullable=False)
    palette_id = Column(UUID(as_uuid=True), nullable=True)

    # Statistics
    total_beads = Column(Integer, default=0)
    color_count = Column(Integer, default=0)
    difficulty = Column(String(10), default="medium")
    estimated_time = Column(Integer, default=0)
    color_summary = Column(JSON, default=[])

    # Display
    preview_url = Column(String(500))
    sort_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False, index=True)
    is_starter = Column(Boolean, default=False, index=True)

    # Statistics
    use_count = Column(Integer, default=0)
    favorite_count = Column(Integer, default=0)

    # Status
    status = Column(String(20), default="active")  # active/inactive
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
