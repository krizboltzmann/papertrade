"use client";

import { useCallback, useEffect, useState } from "react";
import { History } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  formatDateTime,
  formatPrice,
  formatQty,
  formatUsd,
} from "@/lib/format";
import { ApiError } from "@/services/api";
import { fetchTrades } from "@/services/trading";
import type { Trade } from "@/types";

export function TradeHistoryView() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchTrades()
      .then((data) => {
        if (cancelled) {
          return;
        }
        setTrades(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setError(
          err instanceof ApiError ? err.message : "Failed to load trades.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    void fetchTrades()
      .then((data) => {
        setTrades(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError ? err.message : "Failed to load trades.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Trade History"
        description="All simulated buy lots. Lots close when sold down to zero."
      />

      <Card className="animate-fade-in">
        <CardHeader>
          <div>
            <CardTitle>Trades</CardTitle>
            <CardDescription>
              Paper fills recorded against your virtual portfolio.
            </CardDescription>
          </div>
          <Badge variant="default">{trades.length} trades</Badge>
        </CardHeader>

        {loading ? (
          <LoadingState label="Loading trades…" className="min-h-[200px]" />
        ) : null}

        {!loading && error ? (
          <ErrorState
            title="Could not load trades"
            message={error}
            onRetry={refresh}
          />
        ) : null}

        {!loading && !error && trades.length === 0 ? (
          <EmptyState
            icon={History}
            title="No trades yet"
            description="Paper buys will appear here with entry price, size, and status."
          />
        ) : null}

        {!loading && !error && trades.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-elevated/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Opened</th>
                  <th className="px-4 py-3 font-medium">Token</th>
                  <th className="px-4 py-3 font-medium">Buy Price</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Invested</th>
                  <th className="px-4 py-3 font-medium">Mcap</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-t border-border/80 transition-colors hover:bg-surface-hover/40"
                  >
                    <td className="px-4 py-3 text-muted">
                      {formatDateTime(trade.opened_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {trade.token_symbol}
                      </div>
                      <div className="max-w-[160px] truncate text-xs text-muted">
                        {trade.contract_address}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatPrice(trade.buy_price)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatQty(trade.quantity)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatUsd(trade.usd_invested)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatUsd(trade.buy_marketcap, 0)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={trade.status === "OPEN" ? "success" : "default"}
                      >
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
