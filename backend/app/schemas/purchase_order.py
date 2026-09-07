from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.purchase_order import POStatus
from .product import Product

class PurchaseOrderItemBase(BaseModel):
    product_id: str
    quantity: float
    cost_price: float

class PurchaseOrderItemCreate(PurchaseOrderItemBase):
    pass

class PurchaseOrderItemInDB(PurchaseOrderItemBase):
    id: str
    purchase_order_id: str
    product: Optional[Product] = None
    
    model_config = {"from_attributes": True}

class PurchaseOrderBase(BaseModel):
    supplier_id: str
    expected_date: Optional[datetime] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderUpdate(BaseModel):
    status: Optional[POStatus] = None
    expected_date: Optional[datetime] = None

class PurchaseOrderInDBBase(PurchaseOrderBase):
    id: str
    organization_id: str
    status: POStatus
    total_amount: float

    model_config = {"from_attributes": True}

class PurchaseOrder(PurchaseOrderInDBBase):
    items: List[PurchaseOrderItemInDB] = []
