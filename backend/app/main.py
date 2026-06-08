from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base
from app.routers import auth, proposicoes, votacoes, partidos, deputados, eventos, frentes, orgaos, blocos, legislaturas, projects, saved, ods, notifications, daily_summary, politicians

# Importa models primeiro para o SQLAlchemy resolver os relacionamentos
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



api = FastAPI(
    title="LegixTech API",
    description="Backend do aplicativo de monitoramento legislativo com classificação ODS",
    version="2.0.0"
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(auth.router)
api.include_router(projects.router)
api.include_router(saved.router)
api.include_router(ods.router)
api.include_router(notifications.router, prefix="/notifications", tags=["Notificações"])
api.include_router(daily_summary.router, prefix="/daily-summary", tags=["Resumo Diário"])
api.include_router(politicians.router)
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
            "docs": "/docs"
        }
    }

# alias para compatibilidade com uvicorn e Render
app = api