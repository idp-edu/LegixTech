from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True, nullable=False)
    titulo = Column(String, nullable=False)
    ementa = Column(Text, nullable=True)
    situacao = Column(String, nullable=True)
    autor = Column(String, nullable=True)
    ano = Column(Integer, nullable=True, index=True)
    tipo = Column(String, nullable=True, index=True)
    resumo = Column(Text, nullable=True)
    url_texto_oficial = Column(String, nullable=True)
    sincronizado = Column(String, default="camara_api")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    saved_by = relationship("SavedProject", back_populates="project")
    classificacoes = relationship("Classificacao", back_populates="proposicao")
    temas = relationship(
        "Tema", secondary="proposicao_tema", back_populates="proposicoes"
    )