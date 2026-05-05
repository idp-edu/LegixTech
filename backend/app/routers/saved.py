from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.saved import SavedProjectCreate, SavedProjectResponse
from app.services import saved_service

router = APIRouter()

@router.get("/", response_model=list[SavedProjectResponse])
def listar_salvos(user_id: str, db: Session = Depends(get_db)):
    return saved_service.listar_salvos(user_id, db)

@router.post("/", response_model=SavedProjectResponse)
def salvar_projeto(user_id: str, projeto: SavedProjectCreate, db: Session = Depends(get_db)):
    return saved_service.salvar_projeto(user_id, projeto, db)

@router.delete("/{project_id}")
def remover_salvo(project_id: str, user_id: str, db: Session = Depends(get_db)):
    return saved_service.remover_salvo(user_id, project_id, db)