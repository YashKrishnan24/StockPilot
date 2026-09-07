from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models import User, Product, InventoryMovement, OrderItem, PurchaseOrderItem
from app.schemas import ProductCreate, ProductUpdate, Product as ProductSchema

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    # Ensure isolation by organization_id
    stmt = select(Product).filter(Product.organization_id == current_user.organization_id).offset(skip).limit(limit)
    products = db.execute(stmt).scalars().all()
    return products

@router.post("/", response_model=ProductSchema)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: ProductCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    product = Product(
        **product_in.model_dump(),
        organization_id=current_user.organization_id
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/{id}", response_model=ProductSchema)
def read_product(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    product = db.get(Product, id)
    if not product or product.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{id}", response_model=ProductSchema)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    product_in: ProductUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    product = db.get(Product, id)
    if not product or product.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
        
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{id}", response_model=dict)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    product = db.get(Product, id)
    if not product or product.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check for linked history
    movements = db.execute(select(InventoryMovement).where(InventoryMovement.product_id == id)).scalars().first()
    orders = db.execute(select(OrderItem).where(OrderItem.product_id == id)).scalars().first()
    pos = db.execute(select(PurchaseOrderItem).where(PurchaseOrderItem.product_id == id)).scalars().first()
    
    if movements or orders or pos:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete product because it has existing inventory movements, sales orders, or purchase orders. Please mark it as inactive instead."
        )
        
    db.delete(product)
    db.commit()
    return {"success": True, "message": "Product deleted successfully"}
