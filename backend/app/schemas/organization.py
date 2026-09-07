from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class OrganizationBase(BaseModel):
    name: str
    currency: str = "INR"
    timezone: str = "Asia/Kolkata"

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None

class OrganizationInDBBase(OrganizationBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Organization(OrganizationInDBBase):
    pass
