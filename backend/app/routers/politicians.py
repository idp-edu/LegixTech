from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import httpx

from app.core.database import get_db
from app.models.politician import Politician
from app.models.politician_vote import PoliticianVote

router = APIRouter(prefix="/politicos", tags=["Políticos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _buscar_ou_criar_politico(external_id: str, db: Session) -> Politician:
    politico = db.query(Politician).filter(Politician.external_id == external_id).first()
    if politico:
        return politico
    # Busca na API da Câmara
    resp = httpx.get(f"{CAMARA_API}/deputados/{external_id}", timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=404, detail="Político não encontrado na API da Câmara")
    dados = resp.json().get("dados", {})
    politico = Politician(
        external_id=str(dados.get("id")),
        name=dados.get("nomeCivil") or dados.get("nome", ""),
        party=dados.get("ultimoStatus", {}).get("siglaPartido"),
        state=dados.get("ultimoStatus", {}).get("siglaUf"),
        house="Câmara",
        photo_url=dados.get("ultimoStatus", {}).get("urlFoto"),
        bio=dados.get("escolaridade"),
        email=dados.get("ultimoStatus", {}).get("email"),
    )
    db.add(politico)
    db.commit()
    db.refresh(politico)
    return politico


@router.get("/")
def listar_politicos(
    nome: Optional[str] = Query(None),
    partido: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    # Primeiro tenta no banco local
    query = db.query(Politician)
    if nome:
        query = query.filter(Politician.name.ilike(f"%{nome}%"))
    if partido:
        query = query.filter(Politician.party.ilike(f"%{partido}%"))
    if estado:
        query = query.filter(Politician.state == estado.upper())

    total_local = query.count()

    if total_local > 0:
        politicos = query.offset((pagina - 1) * por_pagina).limit(por_pagina).all()
        return {
            "total": total_local,
            "pagina": pagina,
            "por_pagina": por_pagina,
            "fonte": "cache",
            "resultados": [
                {
                    "id": p.id,
                    "external_id": p.external_id,
                    "nome": p.name,
                    "partido": p.party,
                    "estado": p.state,
                    "casa": p.house,
                    "foto": p.photo_url,
                }
                for p in politicos
            ],
        }

    # Se não tem no banco, busca na API da Câmara
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "ASC", "ordenarPor": "nome"}
    if nome:
        params["nome"] = nome
    if partido:
        params["siglaPartido"] = partido
    if estado:
        params["siglaUf"] = estado.upper()

    resp = httpx.get(f"{CAMARA_API}/deputados", params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao consultar API da Câmara")

    dados = resp.json().get("dados", [])
    return {
        "total": len(dados),
        "pagina": pagina,
        "por_pagina": por_pagina,
        "fonte": "camara_api",
        "resultados": [
            {
                "external_id": str(d.get("id")),
                "nome": d.get("nome"),
                "partido": d.get("siglaPartido"),
                "estado": d.get("siglaUf"),
                "casa": "Câmara",
                "foto": d.get("urlFoto"),
            }
            for d in dados
        ],
    }


@router.get("/{external_id}")
def perfil_politico(external_id: str, db: Session = Depends(get_db)):
    politico = _buscar_ou_criar_politico(external_id, db)
    return {
        "id": politico.id,
        "external_id": politico.external_id,
        "nome": politico.name,
        "partido": politico.party,
        "estado": politico.state,
        "casa": politico.house,
        "foto": politico.photo_url,
        "bio": politico.bio,
        "email": politico.email,
        "stats": {
            "total_votos": politico.total_votes,
            "votos_favor": politico.votes_in_favor,
            "votos_contra": politico.votes_against,
            "abstencoes": politico.abstentions,
            "projetos_apresentados": politico.projects_presented,
            "presenca": politico.attendance,
        },
    }


@router.get("/{external_id}/projetos")
def projetos_do_politico(
    external_id: str,
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {
        "idDeputadoAutor": external_id,
        "pagina": pagina,
        "itens": por_pagina,
    }
    resp = httpx.get(f"{CAMARA_API}/proposicoes", params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao consultar proposições na API da Câmara")
    dados = resp.json().get("dados", [])
    return {
        "external_id": external_id,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "total": len(dados),
        "projetos": dados,
    }


@router.get("/{external_id}/votacoes")
def votacoes_do_politico(
    external_id: str,
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    politico = db.query(Politician).filter(Politician.external_id == external_id).first()

    # Primeiro tenta no banco local
    if politico:
        votos = (
            db.query(PoliticianVote)
            .filter(PoliticianVote.politician_id == politico.id)
            .offset((pagina - 1) * por_pagina)
            .limit(por_pagina)
            .all()
        )
        if votos:
            return {
                "external_id": external_id,
                "fonte": "cache",
                "total": len(votos),
                "votacoes": [
                    {
                        "projeto_id": v.project_external_id,
                        "titulo": v.project_title,
                        "voto": v.vote,
                        "data": v.vote_date,
                        "categoria": v.category,
                    }
                    for v in votos
                ],
            }

    # Busca na API da Câmara
    resp = httpx.get(
        f"{CAMARA_API}/deputados/{external_id}/votacoes",
        params={"pagina": pagina, "itens": por_pagina},
        timeout=10,
    )
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao consultar votações na API da Câmara")

    dados = resp.json().get("dados", [])
    return {
        "external_id": external_id,
        "fonte": "camara_api",
        "total": len(dados),
        "votacoes": dados,
    }


# ── Favoritar ──────────────────────────────────────────────────────────────
from app.models.saved_politician import SavedPolitician
from app.core.security import get_current_user
from app.models.user import User
from sqlalchemy.exc import IntegrityError

@router.post("/{external_id}/salvar")
def salvar_politico(
    external_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    politico = _buscar_ou_criar_politico(external_id, db)
    salvo = SavedPolitician(user_id=current_user.id, politician_id=politico.id)
    db.add(salvo)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Político já favoritado")
    return {"mensagem": f"{politico.name} adicionado aos favoritos"}


@router.delete("/{external_id}/salvar")
def remover_politico_salvo(
    external_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    politico = db.query(Politician).filter(Politician.external_id == external_id).first()
    if not politico:
        raise HTTPException(status_code=404, detail="Político não encontrado")
    salvo = (
        db.query(SavedPolitician)
        .filter(
            SavedPolitician.user_id == current_user.id,
            SavedPolitician.politician_id == politico.id,
        )
        .first()
    )
    if not salvo:
        raise HTTPException(status_code=404, detail="Político não está nos favoritos")
    db.delete(salvo)
    db.commit()
    return {"mensagem": f"{politico.name} removido dos favoritos"}


@router.get("/salvos/meus")
def meus_politicos_salvos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    salvos = (
        db.query(SavedPolitician)
        .filter(SavedPolitician.user_id == current_user.id)
        .all()
    )
    return {
        "total": len(salvos),
        "politicos": [
            {
                "id": s.politician.id,
                "external_id": s.politician.external_id,
                "nome": s.politician.name,
                "partido": s.politician.party,
                "estado": s.politician.state,
                "foto": s.politician.photo_url,
                "favoritado_em": s.saved_at,
            }
            for s in salvos
        ],
    }


# ── Notificações ───────────────────────────────────────────────────────────
from app.services import politician_notification_service

@router.post("/notificacoes/verificar")
def verificar_notificacoes_politicos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resultado = politician_notification_service.verificar_novos_projetos(db)
    return resultado
