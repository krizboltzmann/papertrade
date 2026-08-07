from fastapi import APIRouter

from services.health import get_health_status

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    """Liveness probe used by local tooling and future monitoring."""
    return get_health_status()
