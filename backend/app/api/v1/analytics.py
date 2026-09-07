from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.api import deps
from app.models import User, Product, Order, PurchaseOrder, InventoryMovement
from app.models.order import OrderStatus

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    org_id = current_user.organization_id

    total_products = db.scalar(select(func.count(Product.id)).where(Product.organization_id == org_id))
    low_stock = db.scalar(select(func.count(Product.id)).where(Product.organization_id == org_id, Product.current_stock <= Product.min_stock_level))
    pending_orders = db.scalar(select(func.count(Order.id)).where(Order.organization_id == org_id, Order.status == OrderStatus.PENDING.value))
    
    # recent movements
    stmt = select(InventoryMovement).where(InventoryMovement.organization_id == org_id).order_by(InventoryMovement.created_at.desc()).limit(5)
    recent_movements = db.execute(stmt).scalars().all()

    return {
        "total_products": total_products or 0,
        "low_stock_alerts": low_stock or 0,
        "pending_orders": pending_orders or 0,
        "recent_movements": [
            {
                "id": m.id,
                "type": m.movement_type,
                "quantity": m.quantity_change,
                "product_name": m.product.name if m.product else "Unknown",
                "date": m.created_at
            }
            for m in recent_movements
        ]
    }
