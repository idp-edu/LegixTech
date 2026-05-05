from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.saved import SavedProject
from app.schemas.saved import SavedProjectCreate, SavedProjectResponse

router = APIRouter()

@router.get("/", response_model=list[SavedProjectResponse])
def listar_salvos(user_id: str, db: Session = Depends(get_db)):
    return db.query(SavedProject).filter(SavedProject.user_id == user_id).all()

@router.post("/", response_model=SavedProjectResponse)
def salvar_projeto(user_id: str, projeto: SavedProjectCreate, db: Session = Depends(get_db)):
    existente = db.query(SavedProject).filter(
        SavedProject.user_id == user_id,
        SavedProject.project_id == projeto.project_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Projeto já salvo")
    novo = SavedProject(user_id=user_id, **projeto.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.delete("/{project_id}")
def remover_salvo(project_id: str, user_id: str, db: Session = Depends(get_db)):
    salvo = db.query(SavedProject).filter(
        SavedProject.user_id == user_id,
        SavedProject.project_id == project_id
    ).first()
    if not salvo:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    db.delete(salvo)
    db.commit()
    return {"message": "Projeto removido"}