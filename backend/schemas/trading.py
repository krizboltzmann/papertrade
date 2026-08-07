from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PortfolioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    cash_balance: Decimal
    created_at: datetime
    updated_at: datetime
    portfolio_value: Decimal
    open_pnl: Decimal
    realized_pnl: Decimal
    positions_value: Decimal


class PositionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contract_address: str
    token_name: str
    token_symbol: str
    chain: str
    quantity: Decimal
    average_entry: Decimal
    current_price: Decimal
    unrealized_pnl: Decimal
    realized_pnl: Decimal
    market_value: Decimal


class TradeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    token_name: str
    token_symbol: str
    contract_address: str
    chain: str
    buy_price: Decimal
    buy_marketcap: Decimal
    quantity: Decimal
    usd_invested: Decimal
    status: str
    opened_at: datetime
    closed_at: datetime | None


class PaperBuyRequest(BaseModel):
    token_name: str = Field(min_length=1, max_length=120)
    token_symbol: str = Field(min_length=1, max_length=40)
    contract_address: str = Field(min_length=1, max_length=128)
    chain: str = Field(default="solana", min_length=1, max_length=40)
    price: Decimal = Field(gt=0)
    market_cap: Decimal = Field(gt=0)
    amount_usd: Decimal = Field(gt=0)

    @field_validator(
        "token_name",
        "token_symbol",
        "contract_address",
        "chain",
        mode="before",
    )
    @classmethod
    def strip_strings(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value


class PaperSellRequest(BaseModel):
    contract_address: str = Field(min_length=1, max_length=128)
    quantity: Decimal = Field(gt=0)
    sell_price: Decimal = Field(gt=0)

    @field_validator("contract_address", mode="before")
    @classmethod
    def strip_contract(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value


class PaperTradeResponse(BaseModel):
    portfolio: PortfolioOut
    positions: list[PositionOut]
    trade: TradeOut | None = None
