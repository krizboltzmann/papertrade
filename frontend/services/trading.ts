import { apiRequest } from "@/services/api";
import type {
  PaperBuyRequest,
  PaperSellRequest,
  PaperTradeResponse,
  Portfolio,
  Position,
  Trade,
} from "@/types";

export function fetchPortfolio(): Promise<Portfolio> {
  return apiRequest<Portfolio>("/portfolio");
}

export function fetchPositions(): Promise<Position[]> {
  return apiRequest<Position[]>("/positions");
}

export function fetchTrades(): Promise<Trade[]> {
  return apiRequest<Trade[]>("/trades");
}

export function paperBuy(payload: PaperBuyRequest): Promise<PaperTradeResponse> {
  return apiRequest<PaperTradeResponse>("/paper-buy", {
    method: "POST",
    body: payload,
  });
}

export function paperSell(payload: PaperSellRequest): Promise<PaperTradeResponse> {
  return apiRequest<PaperTradeResponse>("/paper-sell", {
    method: "POST",
    body: payload,
  });
}
