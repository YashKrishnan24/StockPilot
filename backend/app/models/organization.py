import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.base import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, index=True, nullable=False)
    currency = Column(String, default="INR", nullable=False)
    timezone = Column(String, default="Asia/Kolkata", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    memberships = relationship("Membership", back_populates="organization", cascade="all, delete-orphan")
