from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/legislaturas", tags=["Legislaturas"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_legislaturas(
    id: Optional[int] = Query(None),
    data: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "id"}
    if id: params["id"] = id
    if data: params["data"] = data
    return _get(f"{CAMARA_API}/legislaturas", params)


@router.get("/{id}")
def detalhe_legislatura(id: int):
    return _get(f"{CAMARA_API}/legislaturas/{id}")


@router.get("/{id}/liderancas")
def liderancas_legislatura(id: int):
    return _get(f"{CAMARA_API}/legislaturas/{id}/liderancas")


@router.get("/{id}/mesa")
def mesa_legislatura(id: int):
    return _get(f"{CAMARA_API}/legislaturas/{id}/mesa")
