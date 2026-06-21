from pydantic import BaseModel
from typing import Optional, List


class PoliticianResponse(BaseModel):
    id: Optional[int] = None
    external_id: str
    name: str
    party: str
    state: str
    house: str
    photo_url: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    is_followed: Optional[bool] = False

    class Config:
        from_attributes = True


class PoliticianListResponse(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    fonte: str
    resultados: List[PoliticianResponse]