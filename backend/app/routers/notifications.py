from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def listar_notificacoes():
    return {"message": "Lista de notificações"}