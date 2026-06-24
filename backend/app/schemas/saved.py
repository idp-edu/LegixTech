from pydantic import BaseModel
from typing import Optional, List


class ProjectSavedResponse(BaseModel):
    id: int
    external_id: str
    titulo: Optional[str] = None
    ementa: Optional[str] = None
    headline: Optional[str] = None   # ← campo adicionado
    situacao: Optional[str] = None
    autor: Optional[str] = None
    ano: Optional[int] = None
    tipo: Optional[str] = None

    class Config:
        from_attributes = True


class SavedListResponse(BaseModel):
    projetos: List[ProjectSavedResponse]
    total: int


class SavedProjectCreate(BaseModel):
    external_id: str