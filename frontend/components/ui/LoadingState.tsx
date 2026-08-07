import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = "Loading…",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40",
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin text-accent" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
