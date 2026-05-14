from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User

def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        return idinfo
    except Exception:
        return None

def get_or_create_user(db: Session, google_data: dict):
    user = db.query(User).filter(
        User.google_id == google_data["sub"]
    ).first()

    if not user:
        user = User(
            email=google_data["email"],
            name=google_data["name"],
            picture=google_data.get("picture"),
            google_id=google_data["sub"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

def login_with_google(db: Session, token: str):
    google_data = verify_google_token(token)
    if not google_data:
        return None

    user = get_or_create_user(db, google_data)
    access_token = create_access_token({"sub": str(user.id)})

    return {"access_token": access_token, "user": user}