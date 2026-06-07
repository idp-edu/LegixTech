from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/votacoes", tags=["Votações"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_votacoes(
    idProposicao: Optional[int] = Query(None),
    idEvento: Optional[int] = Query(None),
    idOrgao: Optional[int] = Query(None),
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraRegistro"}
    if idProposicao: params["idProposicao"] = idProposicao
    if idEvento: params["idEvento"] = idEvento
    if idOrgao: params["idOrgao"] = idOrgao
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/votacoes", params)


@router.get("/{id}")
def detalhe_votacao(id: str):
    return _get(f"{CAMARA_API}/votacoes/{id}")


@router.get("/{id}/votos")
def votos_votacao(id: str):
    return _get(f"{CAMARA_API}/votacoes/{id}/votos")


@router.get("/{id}/orientacoes")
def orientacoes_votacao(id: str):
    return _get(f"{CAMARA_API}/votacoes/{id}/orientacoes")
