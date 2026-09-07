from pydantic import BaseModel
from typing import Optional

class SupplierBase(BaseModel):
    name: str
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class SupplierInDBBase(SupplierBase):
    id: str
    organization_id: str

    model_config = {"from_attributes": True}

class Supplier(SupplierInDBBase):
    pass
