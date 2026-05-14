"""
Endpoints dos 17 Objetivos de Desenvolvimento Sustentável.
"""
from fastapi import APIRouter, HTTPException
from app.services.ods_classifier import buscar_por_ods, _load_ods

router = APIRouter(prefix="/ods", tags=["ODS"])


@router.get("/")
def listar_ods():
    """Retorna todos os 17 ODS com detalhes completos."""
    return _load_ods()


@router.get("/{numero}")
def obter_ods(numero: int):
    """Retorna um ODS específico pelo número (1 a 17)."""
    ods = buscar_por_ods(numero)
    if not ods:
        raise HTTPException(status_code=404, detail=f"ODS {numero} não encontrado")
    return ods