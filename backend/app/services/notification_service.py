from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.notification import Notification

def listar_notificacoes(user_id: str, db: Session):
    return db.query(Notification).filter(Notification.user_id == user_id).all()

def marcar_como_lida(notification_id: int, user_id: str, db: Session):
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

def deletar_notificacao(notification_id: int, user_id: str, db: Session):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    db.delete(notif)
    db.commit()
    return {"message": "Notificação deletada"}