from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse

router = APIRouter()

@router.get("/", response_model=list[NotificationResponse])
def listar_notificacoes(user_id: str, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user_id).all()

@router.patch("/{notification_id}/read")
def marcar_como_lida(notification_id: int, user_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    notif.read = True
    db.commit()
    db.refresh(notif)
    return {"message": "Notificação marcada como lida"}

@router.delete("/{notification_id}")
def deletar_notificacao(notification_id: int, user_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    db.delete(notif)
    db.commit()
    return {"message": "Notificação deletada"}