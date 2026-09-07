from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models import User, PurchaseOrder, PurchaseOrderItem, Product, InventoryMovement
from app.schemas import PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrder as PurchaseOrderSchema
from app.models.purchase_order import POStatus
from app.models.inventory_movement import MovementType

router = APIRouter()

@router.get("/", response_model=List[PurchaseOrderSchema])
def read_pos(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    stmt = select(PurchaseOrder).filter(PurchaseOrder.organization_id == current_user.organization_id).order_by(PurchaseOrder.id.desc()).offset(skip).limit(limit)
    pos = db.execute(stmt).scalars().all()
    return pos

@router.post("/", response_model=PurchaseOrderSchema)
def create_po(
    *,
    db: Session = Depends(deps.get_db),
    po_in: PurchaseOrderCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    po = PurchaseOrder(
        supplier_id=po_in.supplier_id,
        expected_date=po_in.expected_date,
        organization_id=current_user.organization_id,
        status=POStatus.DRAFT.value,
        total_amount=0.0
    )
    db.add(po)
    db.flush()

    total_amount = 0.0
    for item_in in po_in.items:
        item = PurchaseOrderItem(
            purchase_order_id=po.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity,
            cost_price=item_in.cost_price
        )
        db.add(item)
        total_amount += (item_in.quantity * item_in.cost_price)

    po.total_amount = total_amount
    db.commit()
    db.refresh(po)
    return po

@router.post("/{id}/receive", response_model=PurchaseOrderSchema)
def receive_po(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    po = db.get(PurchaseOrder, id)
    if not po or po.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Purchase Order not found")
    
    if po.status == POStatus.RECEIVED.value:
        raise HTTPException(status_code=400, detail="PO already received")

    po.status = POStatus.RECEIVED.value

    # Update inventory
    for item in po.items:
        product = db.get(Product, item.product_id)
        product.current_stock += int(item.quantity)
        
        movement = InventoryMovement(
            organization_id=current_user.organization_id,
            product_id=product.id,
            user_id=current_user.id,
            quantity_change=item.quantity,
            movement_type=MovementType.IN.value,
            reference_id=po.id,
            notes=f"PO Receiving for PO {po.id}"
        )
        db.add(movement)

    db.commit()
    db.refresh(po)
    return po
