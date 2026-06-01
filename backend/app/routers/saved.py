from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.saved import SavedProject
from app.models.project import Project
from app.services.project_service import buscar_detalhe_projeto

router = APIRouter(prefix="/salvos", tags=["Projetos Salvos"])

@router.get("/")
def listar_salvos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    salvos = db.query(SavedProject).filter(
        SavedProject.user_id == current_user.id
    ).all()
    return {"projetos": [s.project for s in salvos], "total": len(salvos)}

@router.post("/{external_id}")
async def salvar_projeto(
    external_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projeto = db.query(Project).filter(Project.external_id == external_id).first()
    if not projeto:
        dados = await buscar_detalhe_projeto(external_id)
        if not dados:
            raise HTTPException(status_code=404, detail="Projeto não encontrado na API da Câmara")
        projeto = Project(
            external_id=external_id,
            titulo=dados.get("ementa", "Sem título")[:200],
            ementa=dados.get("ementa"),
            situacao=dados.get("statusProposicao", {}).get("descricaoSituacao"),
            autor=dados.get("autores", [{}])[0].get("nome") if dados.get("autores") else None,
            ano=dados.get("ano"),
            tipo=dados.get("siglaTipo"),
            url_texto_oficial=dados.get("urlInteiroTeor"),
        )
        db.add(projeto)
        db.commit()
        db.refresh(projeto)

    ja_salvo = db.query(SavedProject).filter(
        SavedProject.user_id == current_user.id,
        SavedProject.project_id == projeto.id
    ).first()
    if ja_salvo:
        raise HTTPException(status_code=400, detail="Projeto já está salvo")

    salvo = SavedProject(user_id=current_user.id, project_id=projeto.id)
    db.add(salvo)
    db.commit()
    return {"message": "Projeto salvo com sucesso", "project_id": projeto.id}

@router.delete("/{external_id}")
def remover_salvo(
    external_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projeto = db.query(Project).filter(Project.external_id == external_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    salvo = db.query(SavedProject).filter(
        SavedProject.user_id == current_user.id,
        SavedProject.project_id == projeto.id
    ).first()
    if not salvo:
        raise HTTPException(status_code=404, detail="Projeto não está na lista de salvos")

    db.delete(salvo)
    db.commit()
    return {"message": "Projeto removido dos salvos"}