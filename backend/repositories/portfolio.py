from decimal import Decimal

from sqlalchemy.orm import Session

from models import Portfolio
from utils.config import get_settings


class PortfolioRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_primary(self) -> Portfolio | None:
        return self._db.query(Portfolio).order_by(Portfolio.id.asc()).first()

    def get_or_create_primary(self) -> Portfolio:
        portfolio = self.get_primary()
        if portfolio is not None:
            return portfolio

        settings = get_settings()
        portfolio = Portfolio(
            cash_balance=Decimal(str(settings.initial_cash_balance)),
            realized_pnl=Decimal("0"),
        )
        self._db.add(portfolio)
        self._db.flush()
        return portfolio

    def save(self, portfolio: Portfolio) -> Portfolio:
        self._db.add(portfolio)
        self._db.flush()
        return portfolio
