from pydantic import BaseModel
from datetime import datetime

class NotificationResponse(BaseModel):
    id: int
    user_id: str
    project_id: str
    message: str
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}