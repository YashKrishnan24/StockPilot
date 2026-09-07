import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    
    name = Column(String, nullable=False, index=True)
    sku = Column(String, nullable=False, index=True) # Should ideally be unique per org
    barcode = Column(String, nullable=True, index=True)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True, index=True)
    
    unit_price = Column(Float, nullable=False, default=0.0)
    cost_price = Column(Float, nullable=False, default=0.0)
    
    min_stock_level = Column(Integer, nullable=False, default=0)
    current_stock = Column(Integer, nullable=False, default=0)

    # Relationships
    organization = relationship("Organization")
    movements = relationship("InventoryMovement", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
    po_items = relationship("PurchaseOrderItem", back_populates="product")
