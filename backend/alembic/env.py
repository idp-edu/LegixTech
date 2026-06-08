from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
from dotenv import load_dotenv

# Adiciona o diretório backend ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

load_dotenv()

# Importa todos os models para o Alembic detectar
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

db_url = os.getenv("DATABASE_URL", "")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
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