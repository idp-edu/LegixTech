from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.followed_politician import FollowedPolitician
from app.models.politician import Politician
from app.schemas.followed_politician import FollowedPoliticianResponse
from typing import List

router = APIRouter(prefix="/seguindo", tags=["Seguindo Políticos"])


@router.get("/", response_model=List[FollowedPoliticianResponse])
def listar_seguindo(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    seguidos = db.query(FollowedPolitician).filter(FollowedPolitician.user_id == current_user.id).all()
    resultado = []
    for s in seguidos:
        p = db.query(Politician).filter(Politician.id == s.politician_id).first()
        resultado.append(FollowedPoliticianResponse(
            id=s.id, user_id=s.user_id, politician_id=s.politician_id, created_at=s.created_at,
            politician_name=p.name if p else None, politician_party=p.party if p else None,
            politician_state=p.state if p else None, politician_photo_url=p.photo_url if p else None,
        ))
    return resultado


@router.post("/{politician_id}", response_model=FollowedPoliticianResponse, status_code=status.HTTP_201_CREATED)
def seguir_politico(politician_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Politician).filter(Politician.id == politician_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Político não encontrado")
    if db.query(FollowedPolitician).filter(FollowedPolitician.user_id == current_user.id, FollowedPolitician.politician_id == politician_id).first():
        raise HTTPException(status_code=400, detail="Você já segue este político")
    novo = FollowedPolitician(user_id=current_user.id, politician_id=politician_id)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return FollowedPoliticianResponse(
        id=novo.id, user_id=novo.user_id, politician_id=novo.politician_id, created_at=novo.created_at,
        politician_name=p.name, politician_party=p.party, politician_state=p.state, politician_photo_url=p.photo_url,
    )


@router.delete("/{politician_id}", status_code=status.HTTP_204_NO_CONTENT)
def deixar_de_seguir(politician_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    registro = db.query(FollowedPolitician).filter(
        FollowedPolitician.user_id == current_user.id,
        FollowedPolitician.politician_id == politician_id
    ).first()
    if not registro:
        raise HTTPException(status_code=404, detail="Você não segue este político")
    db.delete(registro)
    db.commit()