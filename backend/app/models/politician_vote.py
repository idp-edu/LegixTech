from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class PoliticianVote(Base):
    __tablename__ = "politician_votes"

    id = Column(Integer, primary_key=True, index=True)
    politician_id = Column(Integer, ForeignKey("politicians.id"), nullable=False, index=True)
    project_external_id = Column(String, nullable=False)
    project_title = Column(String, nullable=True)
    vote = Column(String, nullable=False)
    vote_date = Column(String, nullable=True)
    category = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    politician = relationship("Politician", back_populates="votes")
