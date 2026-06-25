import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base
from app.routers import (
    auth, proposicoes, votacoes, partidos, deputados, eventos,
    frentes, orgaos, blocos, legislaturas, projects, saved, ods,
    notifications, daily_summary, politicians, followed, chat
)

from app.models import user as user_model  # noqa
from app.models import project as project_model  # noqa
from app.models import saved as saved_model  # noqa
from app.models.tema import Tema  # noqa
from app.models.classificacao import Classificacao  # noqa
from app.models.tag import Tag  # noqa
from app.models.ods import Ods  # noqa
from app.models import relationships  # noqa
from app.models.politician import Politician  # noqa
from app.models.politician_vote import PoliticianVote  # noqa
from app.models.saved_politician import SavedPolitician  # noqa
from app.models.followed_politician import FollowedPolitician  # noqa

logger = logging.getLogger(__name__)


def run_migrations():
    """Roda alembic upgrade head ao iniciar — funciona sem shell no Render."""
    try:
        from alembic.config import Config
        from alembic import command

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))
        alembic_cfg.set_main_option(
            "script_location", os.path.join(base_dir, "alembic")
        )

        # ← FIX: injeta a DATABASE_URL do ambiente no alembic
        # Sem isso, o alembic usa a URL placeholder do alembic.ini e falha silenciosamente
        db_url = os.getenv("MIGRATION_URL") or os.getenv("DATABASE_URL", "")
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)

        if not db_url or db_url == "driver://user:pass@localhost/dbname":
            logger.warning("⚠️  DATABASE_URL não definida — migrations puladas.")
            return

        alembic_cfg.set_main_option("sqlalchemy.url", db_url)
        command.upgrade(alembic_cfg, "head")
        logger.info("✅ Migrations aplicadas com sucesso.")
    except Exception as e:
        logger.error(f"❌ Erro ao rodar migrations: {e}")
        # Não derruba o servidor — loga e continua


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Executa tarefas de startup antes de aceitar requisições."""
    run_migrations()
    yield


api = FastAPI(
    title="LegixTech API",
    description="Backend do aplicativo de monitoramento legislativo com classificação ODS",
    version="2.0.0",
    lifespan=lifespan,
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:19006",
        "http://localhost:19000",
        "http://localhost:3000",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:19006",
        "http://10.0.2.2:8081",
        "http://10.0.2.2:19006",
        "https://legixtech.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

api.include_router(auth.router)
api.include_router(projects.router)
api.include_router(saved.router)
api.include_router(ods.router)
api.include_router(notifications.router, prefix="/notifications", tags=["Notificações"])
api.include_router(daily_summary.router, prefix="/daily-summary", tags=["Resumo Diário"])
api.include_router(politicians.router)
api.include_router(followed.router)
api.include_router(chat.router)
api.include_router(proposicoes.router)
api.include_router(votacoes.router)
api.include_router(partidos.router)
api.include_router(deputados.router)
api.include_router(eventos.router)
api.include_router(frentes.router)
api.include_router(orgaos.router)
api.include_router(blocos.router)
api.include_router(legislaturas.router)


@api.get("/")
def root():
    return {
        "app": "LegixTech API",
        "version": "2.0.0",
        "status": "online",
        "endpoints": {
            "autenticacao": "/auth",
            "projetos": "/projetos",
            "salvos": "/salvos",
            "ods": "/ods",
            "notificacoes": "/notifications",
            "resumo_diario": "/daily-summary",
            "docs": "/docs",
        },
    }


# alias para compatibilidade com uvicorn e Render
app = api