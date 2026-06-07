from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    project_id = Column(String, nullable=True)       # nullable agora
    politician_id = Column(String, nullable=True)    # novo: external_id do político
    tipo = Column(String, nullable=True, default="projeto")  # "projeto" | "politico"
    message = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
