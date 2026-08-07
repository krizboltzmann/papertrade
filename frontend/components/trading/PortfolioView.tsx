"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Wallet } from "lucide-react";

import { BuyDialog } from "@/components/trading/BuyDialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  formatPnl,
  formatPrice,
  formatQty,
  formatUsd,
  pnlClass,
} from "@/lib/format";
import { ApiError } from "@/services/api";
import { fetchPortfolio, fetchPositions } from "@/services/trading";
import type { PaperTradeResponse, Portfolio, Position } from "@/types";

async function loadPortfolioData(): Promise<{
  portfolio: Portfolio;
  positions: Position[];
}> {
  const [portfolio, positions] = await Promise.all([
    fetchPortfolio(),
    fetchPositions(),
  ]);
  return { portfolio, positions };
}

export function PortfolioView() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void loadPortfolioData()
      .then((data) => {
        if (cancelled) {
          return;
        }
        setPortfolio(data.portfolio);
        setPositions(data.positions);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load portfolio data.",
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
    void loadPortfolioData()
      .then((data) => {
        setPortfolio(data.portfolio);
        setPositions(data.positions);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load portfolio data.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBuySuccess = (result: PaperTradeResponse) => {
    setPortfolio(result.portfolio);
    setPositions(result.positions);
  };

  if (loading && !portfolio) {
    return <LoadingState label="Loading portfolio…" />;
  }

  if (error && !portfolio) {
    return (
      <ErrorState
        title="Could not load portfolio"
        message={error}
        onRetry={refresh}
      />
    );
  }

  if (!portfolio) {
    return null;
  }

  const stats = [
    { label: "Cash Balance", value: formatUsd(portfolio.cash_balance) },
    { label: "Portfolio Value", value: formatUsd(portfolio.portfolio_value) },
    { label: "Open Positions", value: String(positions.length) },
    {
      label: "Open PnL",
      value: formatPnl(portfolio.open_pnl),
      className: pnlClass(portfolio.open_pnl),
    },
    {
      label: "Realized PnL",
      value: formatPnl(portfolio.realized_pnl),
      className: pnlClass(portfolio.realized_pnl),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Portfolio"
        description="Simulated holdings funded with virtual cash. Prices are entered manually."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={refresh}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setBuyOpen(true)}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Paper Buy
            </Button>
          </div>
        }
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p
              className={`mt-2 text-xl font-semibold tracking-tight ${stat.className ?? "text-foreground"}`}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 animate-fade-in" style={{ animationDelay: "160ms" }}>
        <CardHeader>
          <div>
            <CardTitle>Open Positions</CardTitle>
            <CardDescription>
              Average entry and mark-to-market use your last manual price.
            </CardDescription>
          </div>
          <Badge variant={positions.length ? "success" : "default"}>
            {positions.length} open
          </Badge>
        </CardHeader>

        {positions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No open positions"
            description="Use Paper Buy to open a simulated memecoin position."
            action={
              <Button size="sm" onClick={() => setBuyOpen(true)}>
                Paper Buy
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-elevated/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Token</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Avg Entry</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Open PnL</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr
                    key={position.id}
                    className="border-t border-border/80 transition-colors hover:bg-surface-hover/40"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {position.token_symbol}
                      </div>
                      <div className="max-w-[180px] truncate text-xs text-muted">
                        {position.token_name} · {position.chain}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatQty(position.quantity)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatPrice(position.average_entry)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatPrice(position.current_price)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatUsd(position.market_value)}
                    </td>
                    <td className={`px-4 py-3 ${pnlClass(position.unrealized_pnl)}`}>
                      {formatPnl(position.unrealized_pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <BuyDialog
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onSuccess={handleBuySuccess}
      />
    </div>
  );
}
