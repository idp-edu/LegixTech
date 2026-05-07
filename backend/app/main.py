from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, projects
from app.routers import auth, projects, saved

Base.metadata.create_all(bind=engine)

api = FastAPI(
    title="LegixTech API",
    description="Backend do aplicativo de monitoramento legislativo",
    version="1.0.0"
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

@api.get("/")
def root():
    return {
        "app": "LegixTech API",
        "version": "1.0.0",
        "status": "online"
    }

api.include_router(saved.router)   