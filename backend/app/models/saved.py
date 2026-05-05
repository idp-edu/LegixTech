from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base

class SavedProject(Base):
    __tablename__ = "saved_projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    project_id = Column(String, nullable=False)
    project_title = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())