from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models import User, Supplier
from app.schemas import SupplierCreate, SupplierUpdate, Supplier as SupplierSchema

router = APIRouter()

@router.get("/", response_model=List[SupplierSchema])
def read_suppliers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    stmt = select(Supplier).filter(Supplier.organization_id == current_user.organization_id).offset(skip).limit(limit)
    suppliers = db.execute(stmt).scalars().all()
    return suppliers

@router.post("/", response_model=SupplierSchema)
def create_supplier(
    *,
    db: Session = Depends(deps.get_db),
    supplier_in: SupplierCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    supplier = Supplier(
        **supplier_in.model_dump(),
        organization_id=current_user.organization_id
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.get("/{id}", response_model=SupplierSchema)
def read_supplier(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    supplier = db.get(Supplier, id)
    if not supplier or supplier.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier
