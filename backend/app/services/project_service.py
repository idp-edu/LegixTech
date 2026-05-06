import httpx
from sqlalchemy.orm import Session
from app.models.project import Project

CAMARA_API_URL = "https://dadosabertos.camara.leg.br/api/v2"

async def buscar_projetos_camara(q: str = None, tipo: str = None, ano: int = None, pagina: int = 1, por_pagina: int = 20):
    params = {
        "ordem": "DESC",
        "ordenarPor": "id",
        "itens": por_pagina,
        "pagina": pagina,
    }

    if q:
        params["keywords"] = q
    if tipo:
        params["siglaTipo"] = tipo
    if ano:
        params["ano"] = ano

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{CAMARA_API_URL}/proposicoes",
            params=params,
            timeout=10.0
        )
        if response.status_code == 200:
            return response.json()
        return None

async def buscar_detalhe_projeto(external_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{CAMARA_API_URL}/proposicoes/{external_id}",
            timeout=10.0
        )
        if response.status_code == 200:
            return response.json().get("dados")
        return None

def get_projetos_salvos(db: Session, user_id: int):
    from app.models.saved import SavedProject
    salvos = db.query(SavedProject).filter(
        SavedProject.user_id == user_id
    ).all()
    return [s.project for s in salvos]