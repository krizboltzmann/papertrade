from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.base import Base
from database.bootstrap import ensure_schema_and_seed
from database.session import SessionLocal, engine
from routes import create_api_router
from utils.config import get_settings

# Ensure models are registered on Base.metadata before create_all.
from models import Portfolio, Position, Trade  # noqa: F401


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        ensure_schema_and_seed(db)
    finally:
        db.close()
    yield


def create_app() -> FastAPI:
    """Application factory for the Paper Trader API."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Simulated memecoin paper trading API. No real blockchain transactions.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(create_api_router(), prefix=settings.api_prefix)

    @app.get("/")
    def root() -> dict[str, str]:
        return {
            "message": "Paper Trader API",
            "docs": "/docs",
            "health": f"{settings.api_prefix}/health",
        }

    return app


app = create_app()
