from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class SavedPolitician(Base):
    __tablename__ = "saved_politicians"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    politician_id = Column(Integer, ForeignKey("politicians.id"), nullable=False)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint("user_id", "politician_id", name="uq_saved_politician"),)

    user = relationship("User", back_populates="saved_politicians")
    politician = relationship("Politician", back_populates="saved_by")
