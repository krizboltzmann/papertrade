from decimal import Decimal

from sqlalchemy.orm import Session

from models import Portfolio
from utils.config import get_settings


def ensure_schema_and_seed(db: Session) -> Portfolio:
    """Ensure a primary portfolio exists with the configured starting cash."""
    portfolio = db.query(Portfolio).order_by(Portfolio.id.asc()).first()
    if portfolio is not None:
        return portfolio

    settings = get_settings()
    portfolio = Portfolio(
        cash_balance=Decimal(str(settings.initial_cash_balance)),
        realized_pnl=Decimal("0"),
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    return portfolio
