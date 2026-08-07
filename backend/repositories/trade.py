from sqlalchemy.orm import Session

from models import Trade, TradeStatus


class TradeRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list_all(self) -> list[Trade]:
        return (
            self._db.query(Trade)
            .order_by(Trade.opened_at.desc(), Trade.id.desc())
            .all()
        )

    def list_open_by_contract(self, contract_address: str) -> list[Trade]:
        return (
            self._db.query(Trade)
            .filter(
                Trade.contract_address == contract_address,
                Trade.status == TradeStatus.OPEN.value,
            )
            .order_by(Trade.opened_at.asc(), Trade.id.asc())
            .all()
        )

    def save(self, trade: Trade) -> Trade:
        self._db.add(trade)
        self._db.flush()
        return trade
