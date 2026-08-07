from fastapi import APIRouter

from routes.health import router as health_router
from routes.trading import router as trading_router


def create_api_router() -> APIRouter:
    """Aggregate all feature routers under a single API router."""
    router = APIRouter()
    router.include_router(health_router, tags=["health"])
    router.include_router(trading_router, tags=["trading"])
    return router
