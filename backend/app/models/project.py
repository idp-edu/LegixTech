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
    ano = Column(Integer, nullable=True)
    tipo = Column(String, nullable=True)
    resumo = Column(Text, nullable=True)
    url_texto_oficial = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    saved_by = relationship("SavedProject", back_populates="project")
