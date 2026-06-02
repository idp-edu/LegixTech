from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, projects, saved, ods, notifications, daily_summary

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
api.include_router(notifications.router, prefix="/notifications", tags=["Notificações"])
api.include_router(daily_summary.router, prefix="/daily-summary", tags=["Resumo Diário"])

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