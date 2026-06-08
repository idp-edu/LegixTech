from fastapi import APIRouter
from datetime import datetime
import httpx

router = APIRouter()

@router.get("/")
async def resumo_diario():
    hoje = datetime.now().strftime("%Y-%m-%d")  # data dinâmica de hoje

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://dadosabertos.camara.leg.br/api/v2/proposicoes",
            params={
                "dataApresentacaoInicio": hoje,  # era "2026-05-01" hardcoded
                "ordenarPor": "id",
                "ordem": "DESC",
                "itens": 5
            }
        )
    dados = response.json()
    proposicoes = dados.get("dados", [])
    return {
        "total": len(proposicoes),
        "proposicoes": [
            {
                "id": p["id"],
                "titulo": p.get("ementa", "Sem ementa"),
                "tipo": p.get("siglaTipo", ""),
                "numero": p.get("numero", ""),
                "ano": p.get("ano", "")
            }
            for p in proposicoes
        ]
    }