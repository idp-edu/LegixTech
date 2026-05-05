from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.saved import SavedProject
from app.schemas.saved import SavedProjectCreate

def listar_salvos(user_id: str, db: Session):
    return db.query(SavedProject).filter(SavedProject.user_id == user_id).all()

def salvar_projeto(user_id: str, projeto: SavedProjectCreate, db: Session):
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

def remover_salvo(user_id: str, project_id: str, db: Session):
    salvo = db.query(SavedProject).filter(
        SavedProject.user_id == user_id,
        SavedProject.project_id == project_id
    ).first()
    if not salvo:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    db.delete(salvo)
    db.commit()
    return {"message": "Projeto removido"}