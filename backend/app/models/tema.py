from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Tema(Base):
    __tablename__ = "temas"

    id = Column(Integer, primary_key=True, index=True)
    cod_tema = Column(Integer, unique=True, index=True, nullable=False)
    nome = Column(String, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    proposicoes = relationship(
        "Project", secondary="proposicao_tema", back_populates="temas"
    )