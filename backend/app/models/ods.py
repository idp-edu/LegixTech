from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Ods(Base):
    __tablename__ = "ods"

    id = Column(Integer, primary_key=True, index=True)
    numero = Column(Integer, unique=True, nullable=False)
    nome = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())