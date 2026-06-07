from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/partidos", tags=["Partidos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_partidos(
    sigla: Optional[str] = Query(None),
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "ASC", "ordenarPor": "sigla"}
    if sigla: params["sigla"] = sigla
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/partidos", params)


@router.get("/{id}")
def detalhe_partido(id: int):
    return _get(f"{CAMARA_API}/partidos/{id}")


@router.get("/{id}/membros")
def membros_partido(
    id: int,
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    return _get(f"{CAMARA_API}/partidos/{id}/membros", {"pagina": pagina, "itens": por_pagina})
