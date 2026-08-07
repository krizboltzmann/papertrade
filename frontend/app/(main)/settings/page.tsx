"use client";

import { ShieldCheck } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { env } from "@/lib/env";
import type { ThemeMode } from "@/types";

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Preferences for appearance and local development."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Dark mode is the default for this trading terminal.
              </CardDescription>
            </div>
            <Badge variant="success">Theme</Badge>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                variant={theme === option.value ? "primary" : "secondary"}
                size="sm"
                onClick={() => setTheme(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "80ms" }}>
          <CardHeader>
            <div>
              <CardTitle>Environment</CardTitle>
              <CardDescription>
                Frontend points at the local FastAPI service.
              </CardDescription>
            </div>
            <Badge variant="info">{env.appEnv}</Badge>
          </CardHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated/50 px-3 py-3">
              <span className="text-muted">API base URL</span>
              <span className="font-mono text-xs text-foreground">
                {env.apiBaseUrl}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated/50 px-3 py-3">
              <span className="text-muted">Execution</span>
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Simulation only
              </span>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in lg:col-span-2" style={{ animationDelay: "140ms" }}>
          <CardHeader>
            <div>
              <CardTitle>Error state preview</CardTitle>
              <CardDescription>
                Reusable error UI for future API failures.
              </CardDescription>
            </div>
          </CardHeader>
          <ErrorState
            title="Trading endpoints are not connected"
            message="This foundation build intentionally has no trade execution. Wire services later without changing this shell."
            className="min-h-[180px]"
          />
        </Card>
      </div>
    </div>
  );
}
