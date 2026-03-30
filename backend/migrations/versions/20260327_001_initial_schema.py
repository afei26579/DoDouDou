"""Initial database schema

Revision ID: 001
Revises:
Create Date: 2026-03-27

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('nickname', sa.String(50), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('password_hash', sa.String(255), nullable=True),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        sa.Column('user_level', sa.String(20), default='beginner'),
        sa.Column('plan', sa.String(20), default='free'),
        sa.Column('plan_expires_at', sa.DateTime(), nullable=True),
        sa.Column('preferences', postgresql.JSON(), default={}),
        sa.Column('monthly_convert_count', sa.Integer(), default=0),
        sa.Column('monthly_convert_reset', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.Column('platform', sa.String(20), default='web'),
        sa.Column('platform_openid', sa.String(255), nullable=True),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Create color_palettes table
    op.create_table(
        'color_palettes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('brand', sa.String(50), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('version', sa.String(20), nullable=True),
        sa.Column('colors', postgresql.JSON(), nullable=False),
        sa.Column('color_count', sa.Integer(), default=0),
        sa.Column('is_default', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_color_palettes_brand', 'color_palettes', ['brand'])

    # Create templates table
    op.create_table(
        'templates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('tags', postgresql.JSON(), default=[]),
        sa.Column('grid_width', sa.Integer(), nullable=False),
        sa.Column('grid_height', sa.Integer(), nullable=False),
        sa.Column('grid_data', postgresql.JSON(), nullable=False),
        sa.Column('palette_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('total_beads', sa.Integer(), default=0),
        sa.Column('color_count', sa.Integer(), default=0),
        sa.Column('difficulty', sa.String(10), default='medium'),
        sa.Column('estimated_time', sa.Integer(), default=0),
        sa.Column('color_summary', postgresql.JSON(), default=[]),
        sa.Column('preview_url', sa.String(500), nullable=True),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_featured', sa.Boolean(), default=False),
        sa.Column('is_starter', sa.Boolean(), default=False),
        sa.Column('use_count', sa.Integer(), default=0),
        sa.Column('favorite_count', sa.Integer(), default=0),
        sa.Column('status', sa.String(20), default='active'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_templates_category', 'templates', ['category'])
    op.create_index('ix_templates_is_featured', 'templates', ['is_featured'])
    op.create_index('ix_templates_is_starter', 'templates', ['is_starter'])

    # Create works table
    op.create_table(
        'works',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('status', sa.String(20), default='draft'),
        sa.Column('source_type', sa.String(20), nullable=False),
        sa.Column('template_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('grid_width', sa.Integer(), nullable=False),
        sa.Column('grid_height', sa.Integer(), nullable=False),
        sa.Column('grid_data', postgresql.JSON(), nullable=False),
        sa.Column('palette_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('scheme_config', postgresql.JSON(), default={}),
        sa.Column('total_beads', sa.Integer(), default=0),
        sa.Column('color_count', sa.Integer(), default=0),
        sa.Column('board_count', sa.Integer(), default=1),
        sa.Column('difficulty', sa.String(10), default='medium'),
        sa.Column('estimated_time', sa.Integer(), default=0),
        sa.Column('color_summary', postgresql.JSON(), default=[]),
        sa.Column('follow_state', postgresql.JSON(), default={}),
        sa.Column('board_layout', postgresql.JSON(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('actual_time', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_works_user_id', 'works', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_works_user_id', 'works')
    op.drop_table('works')
    op.drop_index('ix_templates_is_starter', 'templates')
    op.drop_index('ix_templates_is_featured', 'templates')
    op.drop_index('ix_templates_category', 'templates')
    op.drop_table('templates')
    op.drop_index('ix_color_palettes_brand', 'color_palettes')
    op.drop_table('color_palettes')
    op.drop_index('ix_users_email', 'users')
    op.drop_table('users')

