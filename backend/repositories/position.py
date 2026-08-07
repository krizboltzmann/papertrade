from sqlalchemy.orm import Session

from models import Position


class PositionRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list_all(self) -> list[Position]:
        return (
            self._db.query(Position)
            .order_by(Position.id.asc())
            .all()
        )

    def get_by_contract(self, contract_address: str) -> Position | None:
        return (
            self._db.query(Position)
            .filter(Position.contract_address == contract_address)
            .one_or_none()
        )

    def save(self, position: Position) -> Position:
        self._db.add(position)
        self._db.flush()
        return position

    def delete(self, position: Position) -> None:
        self._db.delete(position)
        self._db.flush()
