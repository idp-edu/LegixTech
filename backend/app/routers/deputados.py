from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/deputados", tags=["Deputados"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


@router.get("/")
def listar_deputados(
    nome: Optional[str] = Query(None),
    idLegislatura: Optional[int] = Query(None),
    siglaUf: Optional[str] = Query(None),
    siglaPartido: Optional[str] = Query(None),
    siglaSexo: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "ASC", "ordenarPor": "nome"}
    if nome: params["nome"] = nome
    if idLegislatura: params["idLegislatura"] = idLegislatura
    if siglaUf: params["siglaUf"] = siglaUf
    if siglaPartido: params["siglaPartido"] = siglaPartido
    if siglaSexo: params["siglaSexo"] = siglaSexo
    return _get(f"{CAMARA_API}/deputados", params)


@router.get("/{id}")
def detalhe_deputado(id: int):
    return _get(f"{CAMARA_API}/deputados/{id}")


@router.get("/{id}/despesas")
def despesas_deputado(
    id: int,
    ano: Optional[int] = Query(None),
    mes: Optional[int] = Query(None),
    cnpjCpfFornecedor: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "ano"}
    if ano: params["ano"] = ano
    if mes: params["mes"] = mes
    if cnpjCpfFornecedor: params["cnpjCpfFornecedor"] = cnpjCpfFornecedor
    return _get(f"{CAMARA_API}/deputados/{id}/despesas", params)


@router.get("/{id}/discursos")
def discursos_deputado(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraInicio"}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/deputados/{id}/discursos", params)


@router.get("/{id}/eventos")
def eventos_deputado(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraInicio"}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/deputados/{id}/eventos", params)


@router.get("/{id}/frentes")
def frentes_deputado(id: int):
    return _get(f"{CAMARA_API}/deputados/{id}/frentes")


@router.get("/{id}/orgaos")
def orgaos_deputado(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/deputados/{id}/orgaos", params)


@router.get("/{id}/votacoes")
def votacoes_deputado(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "dataHoraRegistro"}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/deputados/{id}/votacoes", params)
