from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.notification import NotificationResponse
from app.services import notification_service

router = APIRouter()

@router.get("/", response_model=list[NotificationResponse])
def listar_notificacoes(user_id: str, db: Session = Depends(get_db)):
    return notification_service.listar_notificacoes(user_id, db)

@router.patch("/{notification_id}/read")
def marcar_como_lida(notification_id: int, user_id: str, db: Session = Depends(get_db)):
    return notification_service.marcar_como_lida(notification_id, user_id, db)

@router.delete("/{notification_id}")
def deletar_notificacao(notification_id: int, user_id: str, db: Session = Depends(get_db)):
    return notification_service.deletar_notificacao(notification_id, user_id, db)