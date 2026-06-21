import httpx
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


async def _get_or_fetch_politician(external_id: str, db: Session) -> Politician:
    """Busca político no banco; se não achar, vai na API da Câmara e cria."""
    p = db.query(Politician).filter(Politician.external_id == external_id).first()
    if p:
        return p

    try:
        async with httpx.AsyncClient() as client:  # ✅ assíncrono
            resp = await client.get(
                f"https://dadosabertos.camara.leg.br/api/v2/deputados/{external_id}",
                timeout=10
            )
        if resp.status_code == 200:
            dados = resp.json().get("dados", {})
            p = Politician(
                external_id=external_id,
                name=dados.get("nomeCivil") or dados.get("nome", ""),
                party=dados.get("ultimoStatus", {}).get("siglaPartido") or dados.get("siglaPartido", ""),
                state=dados.get("ultimoStatus", {}).get("siglaUf") or dados.get("siglaUf", ""),
                house="Câmara",
                photo_url=dados.get("ultimoStatus", {}).get("urlFoto") or dados.get("urlFoto", ""),
            )
            db.add(p)
            db.commit()
            db.refresh(p)
            return p
    except Exception:
        pass

    raise HTTPException(status_code=404, detail="Político não encontrado na API da Câmara")


@router.get("/", response_model=List[FollowedPoliticianResponse])
def listar_seguindo(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    seguidos = db.query(FollowedPolitician).filter(FollowedPolitician.user_id == current_user.id).all()
    resultado = []
    for s in seguidos:
        p = db.query(Politician).filter(Politician.id == s.politician_id).first()
        resultado.append(FollowedPoliticianResponse(
            id=s.id,
            user_id=s.user_id,
            politician_id=s.politician_id,
            created_at=s.created_at,
            politician_name=p.name if p else None,
            politician_party=p.party if p else None,
            politician_state=p.state if p else None,
            politician_photo_url=p.photo_url if p else None,
            politician_external_id=p.external_id if p else None,
        ))
    return resultado


@router.post("/{external_id}", response_model=FollowedPoliticianResponse, status_code=status.HTTP_201_CREATED)
async def seguir_politico(external_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = await _get_or_fetch_politician(external_id, db)  # ✅ await na função async

    if db.query(FollowedPolitician).filter(
        FollowedPolitician.user_id == current_user.id,
        FollowedPolitician.politician_id == p.id
    ).first():
        raise HTTPException(status_code=400, detail="Você já segue este político")

    novo = FollowedPolitician(user_id=current_user.id, politician_id=p.id)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return FollowedPoliticianResponse(
        id=novo.id,
        user_id=novo.user_id,
        politician_id=novo.politician_id,
        created_at=novo.created_at,
        politician_name=p.name,
        politician_party=p.party,
        politician_state=p.state,
        politician_photo_url=p.photo_url,
        politician_external_id=p.external_id,
    )


@router.delete("/{external_id}", status_code=status.HTTP_204_NO_CONTENT)
def deixar_de_seguir(external_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Politician).filter(Politician.external_id == external_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Você não segue este político")

    registro = db.query(FollowedPolitician).filter(
        FollowedPolitician.user_id == current_user.id,
        FollowedPolitician.politician_id == p.id
    ).first()
    if not registro:
        raise HTTPException(status_code=404, detail="Você não segue este político")

    db.delete(registro)
    db.commit()