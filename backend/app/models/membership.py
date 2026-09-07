import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.base import Base

class Membership(Base):
    __tablename__ = "memberships"

    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    organization_id = Column(String, ForeignKey("organizations.id"), primary_key=True)
    role = Column(String, nullable=False, default="VIEWER")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="memberships")
