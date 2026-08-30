import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CSE_LOGO_BASE } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Absolute URL for a CSE `logoUrl` / `reqLogo.path` (a relative CDN path). */
export function cseLogoUrl(path?: string | null): string | undefined {
  return path ? `${CSE_LOGO_BASE}${path}` : undefined;
}

/** Route for a symbol — CSE symbols contain a dot, so they must be encoded. */
export function stockHref(symbol: string, market: Market = "US"): string {
  return market === "CSE"
    ? `/cse/${encodeURIComponent(symbol)}`
    : `/stocks/${encodeURIComponent(symbol)}`;
}

const EM_DASH = "—";

const CURRENCY_PREFIX: Record<Currency, string> = {
  USD: "$",
  LKR: "Rs ",
};

/** `123.4` -> `"$123.40"` (or `"Rs 123.40"`), missing/invalid -> `"—"`. */
export function formatPrice(value?: number | null, currency: Currency = "USD"): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return EM_DASH;
  return `${CURRENCY_PREFIX[currency]}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Finnhub `dp` is already a percent: `1.23` -> `"+1.23%"`, `-0.4` -> `"-0.40%"`. */
export function formatChangePercent(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return EM_DASH;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Formats an *absolute* currency amount with a magnitude suffix:
 * `5375031480` -> `"Rs 5.38B"`. CSE reports market cap and turnover this way.
 */
export function formatMarketCap(
  value?: number | null,
  currency: Currency = "USD",
): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return EM_DASH;
  }
  const prefix = CURRENCY_PREFIX[currency];
  if (value >= 1e12) return `${prefix}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${prefix}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${prefix}${(value / 1e6).toFixed(2)}M`;
  return `${prefix}${value.toFixed(0)}`;
}

/** Finnhub `marketCapitalization` is in millions: `2850000` -> `"$2.85T"`. */
export function formatMarketCapValue(millions?: number): string {
  if (typeof millions !== "number" || !Number.isFinite(millions)) return EM_DASH;
  return formatMarketCap(millions * 1_000_000, "USD");
}

/** Share/trade counts: `6875195` -> `"6.88M"`, `543` -> `"543"`. */
export function formatCompactNumber(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return EM_DASH;
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString("en-US");
}

/**
 * CSE timestamps are epoch milliseconds; render them in Colombo time so the
 * "last traded at" on the page matches the exchange's own clock.
 */
export function formatColomboTime(epochMs?: number | null): string {
  if (typeof epochMs !== "number" || !Number.isFinite(epochMs) || epochMs <= 0) {
    return EM_DASH;
  }
  return new Date(epochMs).toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
