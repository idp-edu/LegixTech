from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    tipo_tag = Column(String, nullable=False, index=True)  # proposicao | tema | ods
    label = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    descricao = Column(Text, nullable=True)
    referencia_id = Column(String, nullable=False)
    referencia_tipo = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())