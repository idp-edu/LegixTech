from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import verify_token
from app.services.project_service import buscar_projetos_camara, buscar_detalhe_projeto

router = APIRouter(prefix="/projetos", tags=["Projetos"])

@router.get("/")
async def listar_projetos(
    q: Optional[str] = Query(None, description="Busca por palavra-chave"),
    tipo: Optional[str] = Query(None, description="Tipo: PL, PLC, PLN..."),
    ano: Optional[int] = Query(None, description="Ano do projeto"),
    pagina: int = Query(1, description="Página"),
    por_pagina: int = Query(20, description="Itens por página"),
):
    resultado = await buscar_projetos_camara(
        q=q,
        tipo=tipo,
        ano=ano,
        pagina=pagina,
        por_pagina=por_pagina
    )
    if not resultado:
        raise HTTPException(status_code=503, detail="API da Câmara indisponível")
    return resultado

@router.get("/{external_id}")
async def detalhe_projeto(external_id: str):
    projeto = await buscar_detalhe_projeto(external_id)
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return projeto

@router.get("/temas/disponiveis")
def temas_disponiveis():
    return {
        "temas": [
            "Saúde",
            "Educação",
            "Economia",
            "Meio Ambiente",
            "Segurança",
            "Direitos Humanos"
        ]
    }