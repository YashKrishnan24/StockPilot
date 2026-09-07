from fastapi import APIRouter
from . import auth, products, suppliers, orders, purchase_orders, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(purchase_orders.router, prefix="/purchase-orders", tags=["purchase-orders"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
