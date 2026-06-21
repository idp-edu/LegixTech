from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    picture = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=True)  # <- NOVO
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

    saved_projects = relationship("SavedProject", back_populates="user")
    saved_politicians = relationship("SavedPolitician", back_populates="user")
    followed_politicians = relationship("FollowedPolitician", back_populates="user")

    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan"
    )
