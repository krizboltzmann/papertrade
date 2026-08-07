import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({
  className,
  label,
  hint,
  error,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-xs font-medium text-muted">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-10 w-full rounded-xl border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none transition-all duration-200",
          "placeholder:text-muted/70",
          "focus:border-accent/50 focus:ring-2 focus:ring-accent/20",
          error && "border-danger/50 focus:border-danger focus:ring-danger/20",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
