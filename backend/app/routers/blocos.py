from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/blocos", tags=["Blocos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_blocos(
    idLegislatura: Optional[int] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina}
    if idLegislatura: params["idLegislatura"] = idLegislatura
    return _get(f"{CAMARA_API}/blocos", params)


@router.get("/{id}")
def detalhe_bloco(id: int):
    return _get(f"{CAMARA_API}/blocos/{id}")
