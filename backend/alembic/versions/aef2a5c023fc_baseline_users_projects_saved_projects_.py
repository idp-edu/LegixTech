"""baseline users projects saved_projects notifications

Revision ID: aef2a5c023fc
Revises: 4db6efc720ac
Create Date: 2026-06-07 10:53:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'aef2a5c023fc'
down_revision: Union[str, Sequence[str], None] = '4db6efc720ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tabelas já existem no banco via create_all — nenhuma ação necessária
    pass


def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('saved_projects')
    op.drop_table('projects')
    op.drop_table('users')