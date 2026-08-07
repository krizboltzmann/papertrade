from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.session import get_db
from schemas import (
    PaperBuyRequest,
    PaperSellRequest,
    PaperTradeResponse,
    PortfolioOut,
    PositionOut,
    TradeOut,
)
from services.trading import TradingService

router = APIRouter()


def get_trading_service(db: Session = Depends(get_db)) -> TradingService:
    return TradingService(db)


@router.get("/portfolio", response_model=PortfolioOut)
def get_portfolio(
    service: TradingService = Depends(get_trading_service),
) -> PortfolioOut:
    return service.get_portfolio()


@router.get("/positions", response_model=list[PositionOut])
def get_positions(
    service: TradingService = Depends(get_trading_service),
) -> list[PositionOut]:
    return service.list_positions()


@router.get("/trades", response_model=list[TradeOut])
def get_trades(
    service: TradingService = Depends(get_trading_service),
) -> list[TradeOut]:
    return service.list_trades()


@router.post("/paper-buy", response_model=PaperTradeResponse)
def paper_buy(
    payload: PaperBuyRequest,
    service: TradingService = Depends(get_trading_service),
) -> PaperTradeResponse:
    return service.paper_buy(payload)


@router.post("/paper-sell", response_model=PaperTradeResponse)
def paper_sell(
    payload: PaperSellRequest,
    service: TradingService = Depends(get_trading_service),
) -> PaperTradeResponse:
    return service.paper_sell(payload)
