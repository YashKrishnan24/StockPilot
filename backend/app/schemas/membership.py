from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class MembershipBase(BaseModel):
    role: str

class MembershipCreate(MembershipBase):
    user_id: UUID
    organization_id: UUID

class MembershipUpdate(BaseModel):
    role: Optional[str] = None

class MembershipInDBBase(MembershipBase):
    user_id: UUID
    organization_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Membership(MembershipInDBBase):
    pass
