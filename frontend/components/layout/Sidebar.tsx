"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

const ICONS: Record<(typeof NAV_ITEMS)[number]["icon"], LucideIcon> = {
  LayoutDashboard,
  Wallet,
  History,
  Settings,
};

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-out",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[84px]" : "lg:w-64",
          mobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={onCloseMobile}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
              PT
            </div>
            <div
              className={cn(
                "min-w-0 transition-all duration-300",
                collapsed ? "lg:w-0 lg:opacity-0" : "opacity-100",
              )}
            >
              <p className="truncate text-sm font-semibold text-foreground">
                {APP_NAME}
              </p>
              <p className="truncate text-[11px] text-muted">Paper only</p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0 lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-accent/15 text-accent shadow-glow"
                    : "text-muted hover:bg-surface-hover hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-105",
                  )}
                />
                <span
                  className={cn(
                    "truncate transition-all duration-300",
                    collapsed && "lg:hidden",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-border p-3 lg:block">
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full", collapsed && "px-0")}
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
