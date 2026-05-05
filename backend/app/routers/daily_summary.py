from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/")
async def resumo_diario():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://dadosabertos.camara.leg.br/api/v2/proposicoes",
            params={
                "dataApresentacaoInicio": "2026-05-01",
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