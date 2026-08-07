from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum

from sqlalchemy import DateTime, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TradeStatus(str, Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    cash_balance: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False)
    realized_pnl: Mapped[Decimal] = mapped_column(
        Numeric(18, 8),
        nullable=False,
        default=Decimal("0"),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )


class Trade(Base):
    __tablename__ = "trades"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    token_name: Mapped[str] = mapped_column(String(120), nullable=False)
    token_symbol: Mapped[str] = mapped_column(String(40), nullable=False)
    contract_address: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    chain: Mapped[str] = mapped_column(String(40), nullable=False, default="solana")
    buy_price: Mapped[Decimal] = mapped_column(Numeric(24, 12), nullable=False)
    buy_marketcap: Mapped[Decimal] = mapped_column(Numeric(24, 4), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(28, 12), nullable=False)
    usd_invested: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default=TradeStatus.OPEN.value)
    opened_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Position(Base):
    __tablename__ = "positions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    contract_address: Mapped[str] = mapped_column(
        String(128),
        nullable=False,
        unique=True,
        index=True,
    )
    token_name: Mapped[str] = mapped_column(String(120), nullable=False)
    token_symbol: Mapped[str] = mapped_column(String(40), nullable=False)
    chain: Mapped[str] = mapped_column(String(40), nullable=False, default="solana")
    quantity: Mapped[Decimal] = mapped_column(Numeric(28, 12), nullable=False)
    average_entry: Mapped[Decimal] = mapped_column(Numeric(24, 12), nullable=False)
    current_price: Mapped[Decimal] = mapped_column(Numeric(24, 12), nullable=False)
    unrealized_pnl: Mapped[Decimal] = mapped_column(
        Numeric(18, 8),
        nullable=False,
        default=Decimal("0"),
    )
    realized_pnl: Mapped[Decimal] = mapped_column(
        Numeric(18, 8),
        nullable=False,
        default=Decimal("0"),
    )
