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
from app.schemas.politician import PoliticianResponse, PoliticianListResponse
from app.services import politician_notification_service

router = APIRouter(prefix="/politicos", tags=["Políticos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"
SENADO_API = "https://legis.senado.leg.br/dadosabertos/senador/lista/atual"

_CACHE_MIN_DEPUTADOS = 500


def _buscar_ou_criar_politico(external_id: str, db: Session) -> Politician:
    politico = db.query(Politician).filter(Politician.external_id == external_id).first()
    if politico:
        return politico

    if external_id.startswith("sen_"):
        codigo = external_id.replace("sen_", "")
        try:
            resp = httpx.get(
                f"https://legis.senado.leg.br/dadosabertos/senador/{codigo}",
                headers={"Accept": "application/json"},
                timeout=15,
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=404, detail="Senador não encontrado")

            dados = resp.json()
            detalhe = (
                dados.get("DetalheParlamentar", {})
                .get("Parlamentar", {})
                .get("IdentificacaoParlamentar", {})
            )
            mandato = (
                dados.get("DetalheParlamentar", {})
                .get("Parlamentar", {})
                .get("MandatoAtual", {})
            )

            politico = Politician(
                external_id=external_id,
                name=detalhe.get("NomeParlamentar", ""),
                party=detalhe.get("SiglaPartidoParlamentar", ""),
                state=mandato.get("UfParlamentar", "") or detalhe.get("UfParlamentar", ""),
                house="Senado",
                photo_url=detalhe.get("UrlFotoParlamentar", ""),
                bio=None,
                email=detalhe.get("EmailParlamentar", ""),
            )
            db.add(politico)
            db.commit()
            db.refresh(politico)
            return politico

        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=404, detail="Senador não encontrado")

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

            # ✅ campos em inglês
            resultado.append(PoliticianResponse(
                external_id=f"sen_{codigo}",
                name=nome_senador,
                party=partido_senador,
                state=estado_senador,
                house="Senado",
                photo_url=foto,
            ))

        return resultado
    except Exception:
        return []


@router.get("/", response_model=PoliticianListResponse)
def listar_politicos(
    nome: Optional[str] = Query(None),
    partido: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    casa: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    cache_query = db.query(Politician)
    if casa:
        cache_query = cache_query.filter(Politician.house == casa)

    total_cache = cache_query.count()
    usar_cache = total_cache >= _CACHE_MIN_DEPUTADOS

    if usar_cache:
        q = cache_query
        if nome:
            q = q.filter(Politician.name.ilike(f"%{nome}%"))
        if partido:
            q = q.filter(Politician.party.ilike(f"%{partido}%"))
        if estado:
            q = q.filter(Politician.state == estado.upper())

        total_filtrado = q.count()
        politicos = q.offset((pagina - 1) * por_pagina).limit(por_pagina).all()
        return PoliticianListResponse(
            total=total_filtrado,
            pagina=pagina,
            por_pagina=por_pagina,
            fonte="cache",
            resultados=[
                PoliticianResponse(
                    id=p.id,
                    external_id=p.external_id,
                    name=p.name,
                    party=p.party or "",
                    state=p.state or "",
                    house=p.house or "",
                    photo_url=p.photo_url,
                )
                for p in politicos
            ],
        )

    if casa == "Senado":
        senadores = _buscar_senadores(nome=nome, partido=partido, estado=estado)
        inicio = (pagina - 1) * por_pagina
        return PoliticianListResponse(
            total=len(senadores),
            pagina=pagina,
            por_pagina=por_pagina,
            fonte="senado_api",
            resultados=senadores[inicio: inicio + por_pagina],
        )

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
    # ✅ campos em inglês
    resultados_camara = [
        PoliticianResponse(
            external_id=str(d.get("id")),
            name=d.get("nome", ""),
            party=d.get("siglaPartido", ""),
            state=d.get("siglaUf", ""),
            house="Câmara",
            photo_url=d.get("urlFoto"),
        )
        for d in dados_camara
    ]

    if not casa or casa.lower() == "todos":
        senadores = _buscar_senadores(nome=nome, partido=partido, estado=estado)
        todos = resultados_camara + senadores
        inicio = (pagina - 1) * por_pagina
        return PoliticianListResponse(
            total=len(todos),
            pagina=pagina,
            por_pagina=por_pagina,
            fonte="camara_api+senado_api",
            resultados=todos[inicio: inicio + por_pagina],
        )

    return PoliticianListResponse(
        total=len(resultados_camara),
        pagina=pagina,
        por_pagina=por_pagina,
        fonte="camara_api",
        resultados=resultados_camara,
    )


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
        # ✅ campos em inglês
        "politicos": [
            {
                "id": s.politician.id,
                "external_id": s.politician.external_id,
                "name": s.politician.name,
                "party": s.politician.party,
                "state": s.politician.state,
                "photo_url": s.politician.photo_url,
                "saved_at": s.saved_at,
            }
            for s in salvos
        ],
    }


@router.get("/{external_id}")
def perfil_politico(external_id: str, db: Session = Depends(get_db)):
    p = _buscar_ou_criar_politico(external_id, db)

    votos_db = db.query(PoliticianVote).filter(PoliticianVote.politician_id == p.id).all()
    total = len(votos_db)
    favor = sum(1 for v in votos_db if v.vote == "Sim")
    contra = sum(1 for v in votos_db if v.vote == "Não")
    abstencoes = sum(1 for v in votos_db if v.vote in ("Abstenção", "Abstenção por Liderança"))
  
    outros = total - favor - contra - abstencoes

    return {
        "id": p.id,
        "external_id": p.external_id,
        "name": p.name,
        "party": p.party,
        "state": p.state,
        "house": p.house,
        "photo_url": p.photo_url,
        "bio": p.bio,
        "email": p.email,
        "stats": {
            "total_votes": total,
            "votes_in_favor": favor,
            "votes_against": contra,
            "abstentions": abstencoes,
            "other_votes": outros,        
            "projects_presented": None,   
            "attendance": None,           
        },
    }


@router.get("/{external_id}/projetos")
def projetos_do_politico(
    external_id: str,
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    if external_id.startswith("sen_"):
        return {"external_id": external_id, "pagina": pagina, "por_pagina": por_pagina, "total": 0, "projetos": []}

    params = {"idDeputadoAutor": external_id, "pagina": pagina, "itens": por_pagina}
    resp = httpx.get(f"{CAMARA_API}/proposicoes", params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao consultar proposições na API da Câmara")
    dados = resp.json().get("dados", [])
    return {"external_id": external_id, "pagina": pagina, "por_pagina": por_pagina, "total": len(dados), "projetos": dados}


@router.get("/{external_id}/votacoes")
def votacoes_do_politico(
    external_id: str,
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if external_id.startswith("sen_"):
        return {"external_id": external_id, "fonte": "n/a", "total": 0, "votacoes": []}

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
                    {"projeto_id": v.project_external_id, "titulo": v.project_title, "voto": v.vote, "data": v.vote_date, "categoria": v.category}
                    for v in votos
                ],
            }

    resp = httpx.get(f"{CAMARA_API}/deputados/{external_id}/votacoes", params={"pagina": pagina, "itens": por_pagina}, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Erro ao consultar votações na API da Câmara")
    dados = resp.json().get("dados", [])
    return {"external_id": external_id, "fonte": "camara_api", "total": len(dados), "votacoes": dados}


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
    return {"message": f"{politico.name} adicionado aos favoritos"}


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
        .filter(SavedPolitician.user_id == current_user.id, SavedPolitician.politician_id == politico.id)
        .first()
    )
    if not salvo:
        raise HTTPException(status_code=404, detail="Político não está nos favoritos")
    db.delete(salvo)
    db.commit()
    return {"message": f"{politico.name} removido dos favoritos"}


@router.post("/notificacoes/verificar")
def verificar_notificacoes_politicos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resultado = politician_notification_service.verificar_novos_projetos(db)
    return resultado