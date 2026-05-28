from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base

# Importa models primeiro para o SQLAlchemy resolver os relacionamentos
from app.models import user as user_model  # noqa
from app.models import project as project_model  # noqa
from app.models import saved as saved_model  # noqa
from app.models.tema import Tema  # noqa
from app.models.classificacao import Classificacao  # noqa
from app.models.tag import Tag  # noqa
from app.models import relationships  # noqa

# Importa routers depois
from app.routers import auth, projects, saved, ods

Base.metadata.create_all(bind=engine)

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
            "docs": "/docs"
        }
    }

# alias para compatibilidade com uvicorn e Render
app = api