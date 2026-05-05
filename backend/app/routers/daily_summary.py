from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def resumo_diario():
    return {"message": "Resumo diário"}