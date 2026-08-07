from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import Portfolio, Position, Trade, TradeStatus
from models.trading import utc_now
from repositories import PortfolioRepository, PositionRepository, TradeRepository
from schemas import (
    PaperBuyRequest,
    PaperSellRequest,
    PaperTradeResponse,
    PortfolioOut,
    PositionOut,
    TradeOut,
)
from utils.money import quantize_money, quantize_price, quantize_qty


class TradingService:
    def __init__(self, db: Session) -> None:
        self._db = db
        self._portfolios = PortfolioRepository(db)
        self._positions = PositionRepository(db)
        self._trades = TradeRepository(db)

    def get_portfolio(self) -> PortfolioOut:
        portfolio = self._portfolios.get_or_create_primary()
        positions = self._positions.list_all()
        self._db.commit()
        return self._build_portfolio_out(portfolio, positions)

    def list_positions(self) -> list[PositionOut]:
        self._portfolios.get_or_create_primary()
        positions = self._positions.list_all()
        self._db.commit()
        return [self._to_position_out(position) for position in positions]

    def list_trades(self) -> list[TradeOut]:
        self._portfolios.get_or_create_primary()
        trades = self._trades.list_all()
        self._db.commit()
        return [TradeOut.model_validate(trade) for trade in trades]

    def paper_buy(self, payload: PaperBuyRequest) -> PaperTradeResponse:
        portfolio = self._portfolios.get_or_create_primary()
        amount_usd = quantize_money(payload.amount_usd)
        price = quantize_price(payload.price)

        if amount_usd > portfolio.cash_balance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient cash balance for this paper buy.",
            )

        quantity = quantize_qty(amount_usd / price)
        if quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Buy quantity must be greater than zero.",
            )

        portfolio.cash_balance = quantize_money(portfolio.cash_balance - amount_usd)
        self._portfolios.save(portfolio)

        trade = Trade(
            token_name=payload.token_name,
            token_symbol=payload.token_symbol.upper(),
            contract_address=payload.contract_address,
            chain=payload.chain.lower(),
            buy_price=price,
            buy_marketcap=quantize_money(payload.market_cap),
            quantity=quantity,
            usd_invested=amount_usd,
            status=TradeStatus.OPEN.value,
        )
        self._trades.save(trade)

        position = self._positions.get_by_contract(payload.contract_address)
        if position is None:
            position = Position(
                contract_address=payload.contract_address,
                token_name=payload.token_name,
                token_symbol=payload.token_symbol.upper(),
                chain=payload.chain.lower(),
                quantity=quantity,
                average_entry=price,
                current_price=price,
                unrealized_pnl=Decimal("0"),
                realized_pnl=Decimal("0"),
            )
        else:
            total_qty = quantize_qty(position.quantity + quantity)
            weighted = (position.quantity * position.average_entry) + (quantity * price)
            position.quantity = total_qty
            position.average_entry = quantize_price(weighted / total_qty)
            position.current_price = price
            position.token_name = payload.token_name
            position.token_symbol = payload.token_symbol.upper()
            position.chain = payload.chain.lower()
            position.unrealized_pnl = self._calc_unrealized(
                position.quantity,
                position.average_entry,
                position.current_price,
            )

        self._positions.save(position)
        self._db.commit()
        self._db.refresh(portfolio)
        self._db.refresh(trade)

        positions = self._positions.list_all()
        return PaperTradeResponse(
            portfolio=self._build_portfolio_out(portfolio, positions),
            positions=[self._to_position_out(item) for item in positions],
            trade=TradeOut.model_validate(trade),
        )

    def paper_sell(self, payload: PaperSellRequest) -> PaperTradeResponse:
        portfolio = self._portfolios.get_or_create_primary()
        sell_qty = quantize_qty(payload.quantity)
        sell_price = quantize_price(payload.sell_price)

        position = self._positions.get_by_contract(payload.contract_address)
        if position is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No open position found for this contract address.",
            )

        if sell_qty > position.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sell quantity exceeds available position size.",
            )

        proceeds = quantize_money(sell_qty * sell_price)
        realized = quantize_money((sell_price - position.average_entry) * sell_qty)

        portfolio.cash_balance = quantize_money(portfolio.cash_balance + proceeds)
        portfolio.realized_pnl = quantize_money(portfolio.realized_pnl + realized)
        self._portfolios.save(portfolio)

        self._close_trades_fifo(payload.contract_address, sell_qty)

        remaining_qty = quantize_qty(position.quantity - sell_qty)
        position.realized_pnl = quantize_money(position.realized_pnl + realized)
        position.current_price = sell_price

        if remaining_qty <= 0:
            self._positions.delete(position)
        else:
            position.quantity = remaining_qty
            position.unrealized_pnl = self._calc_unrealized(
                position.quantity,
                position.average_entry,
                position.current_price,
            )
            self._positions.save(position)

        self._db.commit()
        self._db.refresh(portfolio)

        positions = self._positions.list_all()
        return PaperTradeResponse(
            portfolio=self._build_portfolio_out(portfolio, positions),
            positions=[self._to_position_out(item) for item in positions],
            trade=None,
        )

    def _close_trades_fifo(self, contract_address: str, sell_qty: Decimal) -> None:
        remaining = sell_qty
        open_trades = self._trades.list_open_by_contract(contract_address)

        for trade in open_trades:
            if remaining <= 0:
                break

            if trade.quantity <= remaining:
                remaining = quantize_qty(remaining - trade.quantity)
                trade.quantity = Decimal("0")
                trade.usd_invested = Decimal("0")
                trade.status = TradeStatus.CLOSED.value
                trade.closed_at = utc_now()
            else:
                ratio = remaining / trade.quantity
                trade.quantity = quantize_qty(trade.quantity - remaining)
                trade.usd_invested = quantize_money(
                    trade.usd_invested * (Decimal("1") - ratio),
                )
                remaining = Decimal("0")

            self._trades.save(trade)

        if remaining > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Open trade lots are insufficient to cover this sell.",
            )

    @staticmethod
    def _calc_unrealized(
        quantity: Decimal,
        average_entry: Decimal,
        current_price: Decimal,
    ) -> Decimal:
        return quantize_money((current_price - average_entry) * quantity)

    def _to_position_out(self, position: Position) -> PositionOut:
        market_value = quantize_money(position.quantity * position.current_price)
        return PositionOut(
            id=position.id,
            contract_address=position.contract_address,
            token_name=position.token_name,
            token_symbol=position.token_symbol,
            chain=position.chain,
            quantity=position.quantity,
            average_entry=position.average_entry,
            current_price=position.current_price,
            unrealized_pnl=position.unrealized_pnl,
            realized_pnl=position.realized_pnl,
            market_value=market_value,
        )

    def _build_portfolio_out(
        self,
        portfolio: Portfolio,
        positions: list[Position],
    ) -> PortfolioOut:
        cash_balance = quantize_money(portfolio.cash_balance)
        positions_value = quantize_money(
            sum((item.quantity * item.current_price for item in positions), Decimal("0")),
        )
        open_pnl = quantize_money(
            sum((item.unrealized_pnl for item in positions), Decimal("0")),
        )
        return PortfolioOut(
            id=portfolio.id,
            cash_balance=cash_balance,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
            portfolio_value=quantize_money(cash_balance + positions_value),
            open_pnl=open_pnl,
            realized_pnl=quantize_money(portfolio.realized_pnl),
            positions_value=positions_value,
        )
