from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token
from app.schemas.auth import GoogleLoginRequest, TokenResponse
from app.services.auth_service import login_with_google

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/google", response_model=TokenResponse)
def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    result = login_with_google(db, request.token)
    if not result:
        raise HTTPException(status_code=401, detail="Token Google inválido")
    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": result["user"]
    }

@router.get("/me")
def get_me(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    from app.models.user import User
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return user