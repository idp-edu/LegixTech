from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
import httpx

router = APIRouter(prefix="/proposicoes", tags=["Proposições"])

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def _get(url: str, params: dict = {}) -> dict:
    resp = httpx.get(url, params=params, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Erro na API da Câmara: {resp.status_code}")
    return resp.json()


# ── Listagem e detalhe ─────────────────────────────────────────────────────

@router.get("/")
def listar_proposicoes(
    siglaTipo: Optional[str] = Query(None),
    numero: Optional[int] = Query(None),
    ano: Optional[int] = Query(None),
    idDeputadoAutor: Optional[str] = Query(None),
    tema: Optional[str] = Query(None),
    palavrasChave: Optional[str] = Query(None),
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
    params = {"pagina": pagina, "itens": por_pagina, "ordem": "DESC", "ordenarPor": "id"}
    if siglaTipo: params["siglaTipo"] = siglaTipo
    if numero: params["numero"] = numero
    if ano: params["ano"] = ano
    if idDeputadoAutor: params["idDeputadoAutor"] = idDeputadoAutor
    if tema: params["codTema"] = tema
    if palavrasChave: params["keywords"] = palavrasChave
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/proposicoes", params)


@router.get("/{id}")
def detalhe_proposicao(id: int):
    return _get(f"{CAMARA_API}/proposicoes/{id}")


@router.get("/{id}/autores")
def autores_proposicao(id: int):
    return _get(f"{CAMARA_API}/proposicoes/{id}/autores")


@router.get("/{id}/relacionadas")
def proposicoes_relacionadas(id: int):
    return _get(f"{CAMARA_API}/proposicoes/{id}/relacionadas")


@router.get("/{id}/temas")
def temas_proposicao(id: int):
    return _get(f"{CAMARA_API}/proposicoes/{id}/temas")


@router.get("/{id}/tramitacoes")
def tramitacoes_proposicao(
    id: int,
    dataInicio: Optional[str] = Query(None),
    dataFim: Optional[str] = Query(None),
):
    params = {}
    if dataInicio: params["dataInicio"] = dataInicio
    if dataFim: params["dataFim"] = dataFim
    return _get(f"{CAMARA_API}/proposicoes/{id}/tramitacoes", params)


@router.get("/{id}/votacoes")
def votacoes_proposicao(id: int):
    return _get(f"{CAMARA_API}/proposicoes/{id}/votacoes")


# ── Referências ────────────────────────────────────────────────────────────

@router.get("/referencias/codSituacao")
def ref_cod_situacao():
    return _get(f"{CAMARA_API}/referencias/proposicoes/codSituacao")


@router.get("/referencias/codTema")
def ref_cod_tema():
    return _get(f"{CAMARA_API}/referencias/proposicoes/codTema")


@router.get("/referencias/codTipoAutor")
def ref_cod_tipo_autor():
    return _get(f"{CAMARA_API}/referencias/proposicoes/codTipoAutor")


@router.get("/referencias/codTipoTramitacao")
def ref_cod_tipo_tramitacao():
    return _get(f"{CAMARA_API}/referencias/proposicoes/codTipoTramitacao")


@router.get("/referencias/siglaTipo")
def ref_sigla_tipo():
    return _get(f"{CAMARA_API}/referencias/proposicoes/siglaTipo")


@router.get("/referencias/situacoes")
def ref_situacoes():
    return _get(f"{CAMARA_API}/referencias/situacoesProposicao")


@router.get("/referencias/tiposAutor")
def ref_tipos_autor():
    return _get(f"{CAMARA_API}/referencias/tiposAutor")


@router.get("/referencias/tiposProposicao")
def ref_tipos_proposicao():
    return _get(f"{CAMARA_API}/referencias/tiposProposicao")


@router.get("/referencias/tiposTramitacao")
def ref_tipos_tramitacao():
    return _get(f"{CAMARA_API}/referencias/tiposTramitacao")
