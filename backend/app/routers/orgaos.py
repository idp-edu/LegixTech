from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/orgaos", tags=["Órgãos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_orgaos(
    idTipoOrgao: Optional[int] = Query(None),
    sigla: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "ASC", "ordenarPor": "sigla"}
    if idTipoOrgao: params["idTipoOrgao"] = idTipoOrgao
    if sigla: params["sigla"] = sigla
    return _get(f"{CAMARA_API}/orgaos", params)


@router.get("/{id}")
def detalhe_orgao(id: int):
    return _get(f"{CAMARA_API}/orgaos/{id}")


@router.get("/{id}/eventos")
def eventos_orgao(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraInicio"}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/orgaos/{id}/eventos", params)


@router.get("/{id}/membros")
def membros_orgao(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/orgaos/{id}/membros", params)


@router.get("/{id}/votacoes")
def votacoes_orgao(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraRegistro"}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/orgaos/{id}/votacoes", params)


@router.get("/{id}/proposicoes")
def proposicoes_orgao(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHora"}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/orgaos/{id}/proposicoes", params)
