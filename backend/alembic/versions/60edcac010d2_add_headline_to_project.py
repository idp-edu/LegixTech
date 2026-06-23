"""add_headline_to_project

Revision ID: 60edcac010d2
Revises: 17bd11db331c
Create Date: 2026-06-23 08:43:28.199241

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '60edcac010d2'
down_revision: Union[str, Sequence[str], None] = '17bd11db331c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('projects', sa.Column('headline', sa.String(200), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('projects', 'headline')