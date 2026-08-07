import type { Metadata } from "next";
import { Activity, ArrowUpRight, CandlestickChart, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

const stats = [
  {
    label: "Paper Balance",
    value: "$10,000.00",
    hint: "Starting capital",
    badge: "Demo",
  },
  {
    label: "Open Positions",
    value: "0",
    hint: "No live positions yet",
    badge: "Ready",
  },
  {
    label: "Day P&L",
    value: "$0.00",
    hint: "Placeholder metric",
    badge: "Flat",
  },
  {
    label: "Win Rate",
    value: "—",
    hint: "Needs trade history",
    badge: "N/A",
  },
] as const;

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your simulated portfolio and market activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <CardHeader className="mb-3">
              <div>
                <CardDescription className="mt-0">{stat.label}</CardDescription>
                <CardTitle className="mt-2 text-2xl tracking-tight">
                  {stat.value}
                </CardTitle>
              </div>
              <Badge variant="default">{stat.badge}</Badge>
            </CardHeader>
            <p className="text-xs text-muted">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="animate-fade-in lg:col-span-3" style={{ animationDelay: "180ms" }}>
          <CardHeader>
            <div>
              <CardTitle>Market Pulse</CardTitle>
              <CardDescription>
                Live charts and memecoin feeds will appear here.
              </CardDescription>
            </div>
            <Badge variant="info">Coming soon</Badge>
          </CardHeader>
          <div className="space-y-3">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in lg:col-span-2" style={{ animationDelay: "240ms" }}>
          <CardHeader>
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Trading tools are scaffolded but not active yet.
              </CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {[
              {
                icon: CandlestickChart,
                title: "Watchlist",
                copy: "Track trending memecoins",
              },
              {
                icon: TrendingUp,
                title: "Paper Trade",
                copy: "Simulate buys and sells",
              },
              {
                icon: Activity,
                title: "Risk Snapshot",
                copy: "Exposure and drawdown",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated/50 px-3 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted">{item.copy}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <EmptyState
          icon={Activity}
          title="No recent activity"
          description="Once paper trades are enabled, your latest fills and alerts will show up here."
        />
      </div>
    </div>
  );
}
