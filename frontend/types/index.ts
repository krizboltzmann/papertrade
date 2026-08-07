export type ApiErrorBody = {
  detail?: string | { msg?: string }[];
  message?: string;
};

export type HealthStatus = {
  status: string;
  service: string;
  environment: string;
  timestamp: string;
};

export type ThemeMode = "dark" | "light" | "system";

export type TradeStatus = "OPEN" | "CLOSED";

export type Portfolio = {
  id: number;
  cash_balance: string;
  created_at: string;
  updated_at: string;
  portfolio_value: string;
  open_pnl: string;
  realized_pnl: string;
  positions_value: string;
};

export type Position = {
  id: number;
  contract_address: string;
  token_name: string;
  token_symbol: string;
  chain: string;
  quantity: string;
  average_entry: string;
  current_price: string;
  unrealized_pnl: string;
  realized_pnl: string;
  market_value: string;
};

export type Trade = {
  id: number;
  token_name: string;
  token_symbol: string;
  contract_address: string;
  chain: string;
  buy_price: string;
  buy_marketcap: string;
  quantity: string;
  usd_invested: string;
  status: TradeStatus;
  opened_at: string;
  closed_at: string | null;
};

export type PaperBuyRequest = {
  token_name: string;
  token_symbol: string;
  contract_address: string;
  chain: string;
  price: number;
  market_cap: number;
  amount_usd: number;
};

export type PaperSellRequest = {
  contract_address: string;
  quantity: number;
  sell_price: number;
};

export type PaperTradeResponse = {
  portfolio: Portfolio;
  positions: Position[];
  trade: Trade | null;
};
