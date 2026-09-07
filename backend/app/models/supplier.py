import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    
    name = Column(String, nullable=False, index=True)
    contact_email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)

    # Relationships
    organization = relationship("Organization")
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")
