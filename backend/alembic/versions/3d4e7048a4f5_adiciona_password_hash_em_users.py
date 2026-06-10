"""adiciona password_hash em users

Revision ID: 3d4e7048a4f5
Revises: 
Create Date: 2026-06-09

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '3d4e7048a4f5'
down_revision = 'dfedd139890e'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('password_hash', sa.String(), nullable=True))


def downgrade():
    op.drop_column('users', 'password_hash')