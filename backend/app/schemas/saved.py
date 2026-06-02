from pydantic import BaseModel
from datetime import datetime

class SavedProjectCreate(BaseModel):
    project_id: str
    project_title: str

class SavedProjectResponse(BaseModel):
    id: int
    user_id: str
    project_id: str
    project_title: str
    created_at: datetime

    model_config = {"from_attributes": True}