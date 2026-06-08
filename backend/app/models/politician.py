from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Politician(Base):
    __tablename__ = "politicians"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False, index=True)
    party = Column(String, nullable=True, index=True)
    state = Column(String, nullable=True, index=True)
    house = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    email = Column(String, nullable=True)
    total_votes = Column(Integer, default=0)
    votes_in_favor = Column(Integer, default=0)
    votes_against = Column(Integer, default=0)
    abstentions = Column(Integer, default=0)
    projects_presented = Column(Integer, default=0)
    attendance = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    votes = relationship("PoliticianVote", back_populates="politician")

    saved_by = relationship("SavedPolitician", back_populates="politician")
    followed_by = relationship("FollowedPolitician", back_populates="politician")
