from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
import httpx

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.politician import Politician
from app.models.politician_vote import PoliticianVote
from app.models.saved_politician import SavedPolitician
from app.models.user import User
from app.services import politician_notification_service

router = APIRouter(prefix="/politicos", tags=["Políticos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"
SENADO_API = "https://legis.senado.leg.br/dadosabertos/senador/lista/atual"


def _buscar_ou_criar_politico(external_id: str, db: Session) -> Politician:
    politico = db.query(Politician).filter(Politician.external_id == external_id).first()
    if politico:
        return politico
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


def _buscar_senadores(nome: str = None, partido: str = None, estado: str = None) -> list:
    """Busca senadores em exercício na API do Senado Federal."""
    try:
        resp = httpx.get(
            SENADO_API,
            headers={"Accept": "application/json"},
            timeout=15,
        )
        if resp.status_code != 200:
            return []

        dados = resp.json()
        senadores_raw = (
            dados.get("ListaParlamentarEmExercicio", {})
            .get("Parlamentares", {})
            .get("Parlamentar", [])
        )

        resultado = []
        for s in senadores_raw:
            id_senador = s.get("IdentificacaoParlamentar", {})
            nome_senador = id_senador.get("NomeParlamentar", "")
            partido_senador = id_senador.get("SiglaPartidoParlamentar", "")
            estado_senador = id_senador.get("UfParlamentar", "")
            foto = id_senador.get("UrlFotoParlamentar", "")
            codigo = str(id_senador.get("CodigoParlamentar", ""))

            if nome and nome.lower() not in nome_senador.lower():
                continue
            if partido and partido.lower() not in partido_senador.lower():
                continue
            if estado and estado.upper() != estado_senador.upper():
                continue

            resultado.append({
                "external_id": f"sen_{codigo}",
                "nome": nome_senador,
                "partido": partido_senador,
                "estado": estado_senador,
                "casa": "Senado",
                "foto": foto,
            })

        return resultado
    except Exception:
        return []


@router.get("/")
def listar_politicos(
    nome: Optional[str] = Query(None),
    partido: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    casa: Optional[str] = Query(None, description="Câmara, Senado ou None para ambos"),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Politician)
    if nome:
        query = query.filter(Politician.name.ilike(f"%{nome}%"))
    if partido:
        query = query.filter(Politician.party.ilike(f"%{partido}%"))
    if estado:
        query = query.filter(Politician.state == estado.upper())
    if casa:
        query = query.filter(Politician.house == casa)

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

    # Senado: busca na API do Senado
    if casa == "Senado":
        senadores = _buscar_senadores(nome=nome, partido=partido, estado=estado)
        inicio = (pagina - 1) * por_pagina
        return {
            "total": len(senadores),
            "pagina": pagina,
            "por_pagina": por_pagina,
            "fonte": "senado_api",
            "resultados": senadores[inicio: inicio + por_pagina],
        }

    # Câmara ou Todos: busca na API da Câmara
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

    dados_camara = resp.json().get("dados", [])
    resultados_camara = [
        {
            "external_id": str(d.get("id")),
            "nome": d.get("nome"),
            "partido": d.get("siglaPartido"),
            "estado": d.get("siglaUf"),
            "casa": "Câmara",
            "foto": d.get("urlFoto"),
        }
        for d in dados_camara
    ]

    # Se pediu "Todos", combina Câmara + Senado
    if not casa or casa.lower() == "todos":
        senadores = _buscar_senadores(nome=nome, partido=partido, estado=estado)
        inicio = (pagina - 1) * por_pagina
        todos = resultados_camara + senadores
        return {
            "total": len(todos),
            "pagina": pagina,
            "por_pagina": por_pagina,
            "fonte": "camara_api+senado_api",
            "resultados": todos[inicio: inicio + por_pagina],
        }

    return {
        "total": len(resultados_camara),
        "pagina": pagina,
        "por_pagina": por_pagina,
        "fonte": "camara_api",
        "resultados": resultados_camara,
    }


# ── Favoritar — /salvos/meus DEVE vir ANTES de /{external_id} ──────────────

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


@router.post("/notificacoes/verificar")
def verificar_notificacoes_politicos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resultado = politician_notification_service.verificar_novos_projetos(db)
    return resultado