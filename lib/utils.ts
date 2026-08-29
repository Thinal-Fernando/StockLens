import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EM_DASH = "—";

/** `123.4` -> `"$123.40"`, missing/invalid -> `"—"`. */
export function formatPrice(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return EM_DASH;
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Finnhub `dp` is already a percent: `1.23` -> `"+1.23%"`, `-0.4` -> `"-0.40%"`. */
export function formatChangePercent(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return EM_DASH;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/** Finnhub `marketCapitalization` is in millions: `2850000` -> `"$2.85T"`. */
export function formatMarketCapValue(millions?: number): string {
  if (typeof millions !== "number" || !Number.isFinite(millions) || millions <= 0) {
    return EM_DASH;
  }
  const value = millions * 1_000_000;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}
