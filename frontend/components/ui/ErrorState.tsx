import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type ErrorStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn’t load this section. Please try again.",
  actionLabel = "Retry",
  onRetry,
  className,
  children,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-danger/20 bg-danger/5 px-6 text-center",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/15 text-danger">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      </div>
      {children}
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
