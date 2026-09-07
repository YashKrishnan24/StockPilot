from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.inventory_movement import MovementType
from .product import Product

class InventoryMovementBase(BaseModel):
    product_id: str
    quantity_change: float
    movement_type: MovementType
    reference_id: Optional[str] = None
    notes: Optional[str] = None

class InventoryMovementCreate(InventoryMovementBase):
    pass

class InventoryMovementInDBBase(InventoryMovementBase):
    id: str
    organization_id: str
    user_id: str
    created_at: datetime
    
    model_config = {"from_attributes": True}

class InventoryMovement(InventoryMovementInDBBase):
    product: Optional[Product] = None
