from pydantic import BaseModel
from typing import Optional, List
from app.models.order import OrderStatus
from .product import Product

class OrderItemBase(BaseModel):
    product_id: str
    quantity: float
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemInDB(OrderItemBase):
    id: str
    order_id: str
    product: Optional[Product] = None
    
    model_config = {"from_attributes": True}

class OrderBase(BaseModel):
    customer_name: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    customer_name: Optional[str] = None

class OrderInDBBase(OrderBase):
    id: str
    organization_id: str
    status: OrderStatus
    total_amount: float

    model_config = {"from_attributes": True}

class Order(OrderInDBBase):
    items: List[OrderItemInDB] = []
