from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Classificacao(Base):
    __tablename__ = "classificacoes"

    id = Column(Integer, primary_key=True, index=True)
    proposicao_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    ods_numero = Column(Integer, nullable=False)
    ods_nome = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    confianca = Column(String, nullable=False)
    metodo = Column(String, default="keywords")
    justificativa = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    proposicao = relationship("Project", back_populates="classificacoes")