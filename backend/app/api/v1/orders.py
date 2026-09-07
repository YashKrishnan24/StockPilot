from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api import deps
from app.models import User, Order, OrderItem, Product, InventoryMovement
from app.schemas import OrderCreate, OrderUpdate, Order as OrderSchema
from app.models.order import OrderStatus
from app.models.inventory_movement import MovementType

router = APIRouter()

@router.get("/", response_model=List[OrderSchema])
def read_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    stmt = select(Order).filter(Order.organization_id == current_user.organization_id).order_by(Order.id.desc()).offset(skip).limit(limit)
    orders = db.execute(stmt).scalars().all()
    return orders

@router.post("/", response_model=OrderSchema)
def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: OrderCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    order = Order(
        customer_name=order_in.customer_name,
        organization_id=current_user.organization_id,
        status=OrderStatus.PENDING.value,
        total_amount=0.0
    )
    db.add(order)
    db.flush() # get ID

    total_amount = 0.0
    for item_in in order_in.items:
        # fetch product
        product = db.get(Product, item_in.product_id)
        if not product or product.organization_id != current_user.organization_id:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Product {item_in.product_id} not found")
        
        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item_in.quantity,
            unit_price=item_in.unit_price
        )
        db.add(item)
        total_amount += (item_in.quantity * item_in.unit_price)

    order.total_amount = total_amount
    db.commit()
    db.refresh(order)
    return order

@router.post("/{id}/fulfill", response_model=OrderSchema)
def fulfill_order(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    order = db.get(Order, id)
    if not order or order.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status == OrderStatus.FULFILLED.value:
        raise HTTPException(status_code=400, detail="Order already fulfilled")

    order.status = OrderStatus.FULFILLED.value

    # Update inventory
    for item in order.items:
        product = db.get(Product, item.product_id)
        product.current_stock -= int(item.quantity)
        
        movement = InventoryMovement(
            organization_id=current_user.organization_id,
            product_id=product.id,
            user_id=current_user.id,
            quantity_change=-item.quantity,
            movement_type=MovementType.OUT.value,
            reference_id=order.id,
            notes=f"Order Fulfillment for order {order.id}"
        )
        db.add(movement)

    db.commit()
    db.refresh(order)
    return order
