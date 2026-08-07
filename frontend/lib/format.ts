export function formatUsd(value: string | number, digits = 2): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return "$—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatQty(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(amount);
}

export function formatPrice(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return "—";
  }

  if (amount > 0 && amount < 0.01) {
    return amount.toPrecision(4);
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(amount);
}

export function formatPnl(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return "—";
  }

  const formatted = formatUsd(Math.abs(amount));
  if (amount > 0) {
    return `+${formatted}`;
  }
  if (amount < 0) {
    return `-${formatted}`;
  }
  return formatUsd(0);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function pnlClass(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (amount > 0) {
    return "text-accent";
  }
  if (amount < 0) {
    return "text-danger";
  }
  return "text-muted";
}
