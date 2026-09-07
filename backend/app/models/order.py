import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    FULFILLED = "FULFILLED"
    CANCELLED = "CANCELLED"

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False, index=True)
    
    customer_name = Column(String, nullable=True)
    status = Column(String, default=OrderStatus.PENDING.value)
    total_amount = Column(Float, nullable=False, default=0.0)
    
    # Relationships
    organization = relationship("Organization")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    
    quantity = Column(Float, nullable=False, default=1.0)
    unit_price = Column(Float, nullable=False, default=0.0)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
