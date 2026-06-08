from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.services import notification_service

router = APIRouter()


@router.get("/", response_model=list[NotificationResponse])
def listar_notificacoes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return notification_service.listar_notificacoes(current_user.id, db)


@router.patch("/{notification_id}/read")
def marcar_como_lida(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return notification_service.marcar_como_lida(notification_id, current_user.id, db)


@router.delete("/{notification_id}")
def deletar_notificacao(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return notification_service.deletar_notificacao(notification_id, current_user.id, db)