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

# ✅ Configuração global — formata todos os loggers da aplicação
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def run_migrations():
    try:
        from alembic.config import Config
        from alembic import command

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        alembic_cfg = Config(os.path.join(base_dir, "alembic.ini"))
        alembic_cfg.set_main_option("script_location", os.path.join(base_dir, "alembic"))

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


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    yield


# ✅ Removido alias `api` — objeto direto chamado `app`
app = FastAPI(
    title="LegixTech API",
    description="Backend do aplicativo de monitoramento legislativo com classificação ODS",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
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

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(saved.router)
app.include_router(ods.router)
app.include_router(notifications.router, prefix="/notifications", tags=["Notificações"])
app.include_router(daily_summary.router, prefix="/daily-summary", tags=["Resumo Diário"])
app.include_router(politicians.router)
app.include_router(followed.router)
app.include_router(chat.router)
app.include_router(proposicoes.router)
app.include_router(votacoes.router)
app.include_router(partidos.router)
app.include_router(deputados.router)
app.include_router(eventos.router)
app.include_router(frentes.router)
app.include_router(orgaos.router)
app.include_router(blocos.router)
app.include_router(legislaturas.router)


@app.get("/")
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