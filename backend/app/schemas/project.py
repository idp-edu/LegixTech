from pydantic import BaseModel
from typing import Optional, List

class ProjectResponse(BaseModel):
    id: int
    external_id: str
    titulo: str
    ementa: Optional[str] = None
    situacao: Optional[str] = None
    autor: Optional[str] = None
    ano: Optional[int] = None
    tipo: Optional[str] = None
    resumo: Optional[str] = None
    url_texto_oficial: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectListResponse(BaseModel):
    total: int
    projetos: List[ProjectResponse]

class ProjectSearchParams(BaseModel):
    q: Optional[str] = None
    tema: Optional[str] = None
    tipo: Optional[str] = None
    ano: Optional[int] = None
    pagina: int = 1
    por_pagina: int = 20