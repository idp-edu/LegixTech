from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

load_dotenv()

from app.core.database import Base
from app.models.user import User
from app.models.project import Project
from app.models.saved import SavedProject
from app.models.tema import Tema
from app.models.classificacao import Classificacao
from app.models.tag import Tag
from app.models.ods import Ods
from app.models.notification import Notification  # noqa
from app.models.relationships import proposicao_tema, tema_ods
from app.models.politician import Politician  # noqa
from app.models.politician_vote import PoliticianVote  # noqa
from app.models.saved_politician import SavedPolitician  # noqa

config = context.config


def _build_url(raw_url: str) -> str:
    url = raw_url.strip()
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    if "?" not in url:
        url += "?sslmode=require"
    elif "sslmode" not in url:
        url += "&sslmode=require"
    return url


db_url = os.getenv("MIGRATION_URL") or os.getenv("DATABASE_URL", "")
db_url = _build_url(db_url)
config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()