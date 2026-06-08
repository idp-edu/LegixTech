from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/eventos", tags=["Eventos"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_eventos(
    idTipoEvento: Optional[int] = Query(None),
    idOrgao: Optional[int] = Query(None),
    idDeputado: Optional[int] = Query(None),
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    horaInicio: Optional[str] = Query(None),
    horaFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraInicio"}
    if idTipoEvento: params["idTipoEvento"] = idTipoEvento
    if idOrgao: params["idOrgao"] = idOrgao
    if idDeputado: params["idDeputado"] = idDeputado
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    if horaInicio: params["horaInicio"] = horaInicio
    if horaFim: params["horaFim"] = horaFim
    return _get(f"{CAMARA_API}/eventos", params)


@router.get("/{id}")
def detalhe_evento(id: int):
    return _get(f"{CAMARA_API}/eventos/{id}")


@router.get("/{id}/deputados")
def deputados_evento(id: int):
    return _get(f"{CAMARA_API}/eventos/{id}/deputados")


@router.get("/{id}/orgaos")
def orgaos_evento(id: int):
    return _get(f"{CAMARA_API}/eventos/{id}/orgaos")


@router.get("/{id}/pauta")
def pauta_evento(id: int):
    return _get(f"{CAMARA_API}/eventos/{id}/pauta")


@router.get("/{id}/votacoes")
def votacoes_evento(id: int):
    return _get(f"{CAMARA_API}/eventos/{id}/votacoes")
