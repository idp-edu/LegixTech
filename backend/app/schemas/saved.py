from pydantic import BaseModel
from typing import Optional, List

class ProjectSavedResponse(BaseModel):
    id: int
    external_id: str
    titulo: Optional[str] = None
    ementa: Optional[str] = None
    situacao: Optional[str] = None
    autor: Optional[str] = None
    ano: Optional[int] = None
    tipo: Optional[str] = None

    class Config:
        from_attributes = True  # Pydantic v2 (ou orm_mode = True para Pydantic v1)

class SavedListResponse(BaseModel):
    projetos: List[ProjectSavedResponse]
    total: int