"use client";

import { Menu, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type TopNavProps = {
  title: string;
  onMenuClick: () => void;
};

export function TopNav({ title, onMenuClick }: TopNavProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-topnav/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 px-0 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="hidden text-xs text-muted sm:block">
            Simulated market data · no real trades
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="success">Paper Mode</Badge>
        <Button
          variant="secondary"
          size="sm"
          className="h-9 w-9 px-0"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label="Toggle theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
