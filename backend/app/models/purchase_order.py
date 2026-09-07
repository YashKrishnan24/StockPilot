import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base

class POStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    RECEIVED = "RECEIVED"
    CANCELLED = "CANCELLED"

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=False, index=True)
    
    status = Column(String, default=POStatus.DRAFT.value)
    total_amount = Column(Float, nullable=False, default=0.0)
    expected_date = Column(DateTime, nullable=True)
    
    # Relationships
    organization = relationship("Organization")
    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order")

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    purchase_order_id = Column(String, ForeignKey("purchase_orders.id"), nullable=False, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    
    quantity = Column(Float, nullable=False, default=1.0) # Using float in case of weight etc., but generally int.
    cost_price = Column(Float, nullable=False, default=0.0)
    
    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product", back_populates="po_items")
