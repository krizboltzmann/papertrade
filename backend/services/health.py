from datetime import datetime, timezone

from utils.config import get_settings


def get_health_status() -> dict[str, str]:
    """Return a lightweight service health payload."""
    settings = get_settings()
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.app_env,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
