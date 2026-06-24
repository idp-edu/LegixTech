from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.saved import SavedProject
from app.models.project import Project
from app.services.project_service import buscar_detalhe_projeto
from app.services.resumo_service import gerar_headline
from app.schemas.saved import SavedListResponse


router = APIRouter(prefix="/salvos", tags=["Projetos Salvos"])


def _parse_date(s):
    if not s:
        return None
    try:
        return datetime.fromisoformat(str(s).replace("Z", "")).date()
    except Exception:
        return None


def _montar_titulo(sigla: str, numero, ano, ementa: str) -> str:
    partes = [str(p).strip() for p in [sigla, numero] if str(p).strip()]
    base = " ".join(partes)
    if ano:
        base = f"{base} / {ano}".strip(" /")
    return base.strip() or ementa[:200] or "Sem título"


@router.get("/", response_model=SavedListResponse)
def listar_salvos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    salvos = db.query(SavedProject).filter(
        SavedProject.user_id == current_user.id
    ).all()

    projetos = []
    for s in salvos:
        if s.project is None:
            continue
        p = s.project
        projetos.append({
            "id": p.id,
            "external_id": p.external_id,
            "titulo": p.titulo,
            "ementa": p.ementa,
            "headline": p.headline,
            "situacao": p.situacao,
            "autor": p.autor,
            "ano": p.ano,
            "tipo": p.tipo,
        })

    return {"projetos": projetos, "total": len(projetos)}


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

        _autores = dados.get("autores") or []
        _status  = dados.get("statusProposicao") or {}
        _sigla   = dados.get("siglaTipo", "")
        _numero  = dados.get("numero", "")
        _ano     = dados.get("ano", "")

        headline = await gerar_headline(
            ementa=dados.get("ementa", ""),
            sigla_tipo=_sigla,
            numero=str(_numero),
        )

        projeto = Project(
            external_id=external_id,
            titulo=_montar_titulo(_sigla, _numero, _ano, dados.get("ementa", "")),
            ementa=dados.get("ementa"),
            situacao=_status.get("descricaoSituacao") or dados.get("situacao"),
            autor=(
                ", ".join(a["nome"] for a in _autores if a.get("nome"))
                or dados.get("autor")
                or "Não informado"
            ),
            ano=_ano or None,
            tipo=_sigla or dados.get("tipo"),
            url_texto_oficial=dados.get("urlInteiroTeor"),
            data_apresentacao=_parse_date(
                dados.get("dataApresentacao") or dados.get("data_apresentacao")
            ),
            headline=headline,
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