"""
Proxy HTTP para a API de Dados Abertos da Câmara dos Deputados.
Cache in-memory de 15 minutos para reduzir chamadas externas.
"""
import time
import httpx
from typing import Any, Optional

BASE_URL = "https://dadosabertos.camara.leg.br/api/v2"
CACHE_TTL = 900  # 15 minutos

_cache: dict[str, tuple[float, Any]] = {}


def _cache_get(key: str) -> Optional[Any]:
    entry = _cache.get(key)
    if entry and (time.time() - entry[0]) < CACHE_TTL:
        return entry[1]
    return None


def _cache_set(key: str, value: Any) -> None:
    _cache[key] = (time.time(), value)


async def _get(path: str, params: dict | None = None) -> Any:
    cache_key = path + str(sorted((params or {}).items()))
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.get(
            f"{BASE_URL}{path}",
            params=params,
            headers={"Accept": "application/json"},
        )
        response.raise_for_status()
        data = response.json()

    _cache_set(cache_key, data)
    return data


async def listar_proposicoes(
    siglaTipo: str | None = None,
    dataApresentacaoInicio: str | None = None,
    dataApresentacaoFim: str | None = None,
    keywords: str | None = None,
    pagina: int = 1,
    itens: int = 20,
) -> dict:
    params: dict[str, Any] = {
        "pagina": pagina,
        "itens": itens,
        "ordenarPor": "id",
        "ordem": "DESC",
    }
    if siglaTipo:
        params["siglaTipo"] = siglaTipo
    if dataApresentacaoInicio:
        params["dataApresentacaoInicio"] = dataApresentacaoInicio
    if dataApresentacaoFim:
        params["dataApresentacaoFim"] = dataApresentacaoFim
    if keywords:
        params["keywords"] = keywords

    try:
        return await _get("/proposicoes", params)
    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code if exc.response is not None else None
        if status == 400:
            fallback = dict(params)
            fallback.pop("ordenarPor", None)
            fallback.pop("ordem", None)
            return await _get("/proposicoes", fallback)
        if status in {502, 503, 504}:
            return {"dados": [], "links": [], "erro_upstream": status}
        raise
    except (httpx.TimeoutException, httpx.ConnectError):
        return {"dados": [], "links": [], "erro_upstream": "timeout"}


async def obter_proposicao(id: int) -> dict:
    return await _get(f"/proposicoes/{id}")


async def obter_autores(id: int) -> dict:
    return await _get(f"/proposicoes/{id}/autores")


async def obter_temas(id: int) -> dict:
    return await _get(f"/proposicoes/{id}/temas")


async def obter_tramitacoes(id: int) -> dict:
    try:
        return await _get(f"/proposicoes/{id}/tramitacoes", {"ordem": "ASC"})
    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code if exc.response is not None else None
        if status == 400:
            return await _get(f"/proposicoes/{id}/tramitacoes")
        if status in {404, 502, 503, 504}:
            return {"dados": [], "links": [], "erro_upstream": status}
        raise
    except (httpx.TimeoutException, httpx.ConnectError):
        return {"dados": [], "links": [], "erro_upstream": "timeout"}


async def listar_tipos_proposicao() -> dict:
    return await _get("/referencias/proposicoes/siglaTipo")


async def listar_situacoes_proposicao() -> dict:
    return await _get("/referencias/proposicoes/codSituacao")