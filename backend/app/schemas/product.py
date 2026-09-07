from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    sku: str
    barcode: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: float = 0.0
    cost_price: float = 0.0
    min_stock_level: int = 0
    is_active: bool = True

class ProductCreate(ProductBase):
    current_stock: int = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[float] = None
    cost_price: Optional[float] = None
    min_stock_level: Optional[int] = None

class ProductInDBBase(ProductBase):
    id: str
    organization_id: str
    current_stock: int

    model_config = {"from_attributes": True}

class Product(ProductInDBBase):
    pass
