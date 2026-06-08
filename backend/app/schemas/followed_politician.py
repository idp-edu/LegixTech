from pydantic import BaseModel
from datetime import datetime


class FollowedPoliticianCreate(BaseModel):
    politician_id: int


class FollowedPoliticianResponse(BaseModel):
    id: int
    user_id: int
    politician_id: int
    created_at: datetime
    politician_name: str | None = None
    politician_party: str | None = None
    politician_state: str | None = None
    politician_photo_url: str | None = None

    class Config:
        from_attributes = True