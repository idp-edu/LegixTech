"""fix_notification_user_id_to_integer_with_fk

Revision ID: 17bd11db331c
Revises: 3d4e7048a4f5
Create Date: 2026-06-21 15:20:46.314088

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '17bd11db331c'
down_revision: Union[str, Sequence[str], None] = '3d4e7048a4f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Converte user_id de VARCHAR para INTEGER (via USING, caso ainda seja string)
    op.execute(
        "ALTER TABLE notifications ALTER COLUMN user_id TYPE INTEGER USING user_id::INTEGER"
    )

    # Adiciona a Foreign Key
    op.create_foreign_key(
        'fk_notifications_user_id',
        'notifications', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    # Cria índice no user_id
    op.create_index(op.f('ix_notifications_user_id'), 'notifications', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_notifications_user_id'), table_name='notifications')
    op.drop_constraint('fk_notifications_user_id', 'notifications', type_='foreignkey')
    op.alter_column('notifications', 'user_id',
               existing_type=sa.Integer(),
               type_=sa.String(),
               existing_nullable=False) 