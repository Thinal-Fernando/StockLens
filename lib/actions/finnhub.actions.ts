"use server";

import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";
import { cache } from "react";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const NEXT_PUBLIC_FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

type Profile2 = {
  name?: string;
  ticker?: string;
  exchange?: string;
  logo?: string;
};

// FinnhubSearchResult plus two fields we stash internally while building results
type EnrichedResult = FinnhubSearchResult & {
  __exchange?: string;
  __logo?: string;
};

async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number,
): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } =
    revalidateSeconds
      ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export { fetchJSON };

export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
      if (!token) {
        // If no token, log and return empty to avoid throwing per requirements
        console.error(
          "Error in stock search:",
          new Error("FINNHUB API key is not configured"),
        );
        return [];
      }

      const trimmed = typeof query === "string" ? query.trim() : "";

      let results: EnrichedResult[] = [];

      if (!trimmed) {
        // Fetch top 10 popular symbols' profiles
        const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
        const profiles = await Promise.all(
          top.map(
            async (
              sym,
            ): Promise<{ sym: string; profile: Profile2 | null }> => {
              try {
                const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${token}`;
                // Revalidate every hour
                const profile = await fetchJSON<Profile2>(url, 3600);
                return { sym, profile };
              } catch (e) {
                console.error("Error fetching profile2 for", sym, e);
                return { sym, profile: null };
              }
            },
          ),
        );

        results = profiles
          .map(({ sym, profile }) => {
            const symbol = sym.toUpperCase();
            const name: string | undefined =
              profile?.name || profile?.ticker || undefined;
            const exchange: string | undefined = profile?.exchange || undefined;
            if (!name) return undefined;
            const r: EnrichedResult = {
              symbol,
              description: name,
              displaySymbol: symbol,
              type: "Common Stock",
            };
            // We don't include exchange in FinnhubSearchResult type, so carry via mapping later using profile
            // To keep pipeline simple, attach exchange via closure map stage
            // We'll reconstruct exchange when mapping to final type
            r.__exchange = exchange; // internal only
            r.__logo = profile?.logo || undefined; // real logo from profile2
            return r;
          })
          .filter((x): x is EnrichedResult => Boolean(x));
      } else {
        const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmed)}&token=${token}`;
        const data = await fetchJSON<FinnhubSearchResponse>(url, 1800);
        results = Array.isArray(data?.result) ? data.result : [];
      }

      const mapped: StockWithWatchlistStatus[] = results
        .map((r) => {
          const upper = (r.symbol || "").toUpperCase();
          const name = r.description || upper;
          const exchangeFromDisplay =
            (r.displaySymbol as string | undefined) || undefined;
          const exchangeFromProfile = r.__exchange;
          const exchange = exchangeFromDisplay || exchangeFromProfile || "US";
          const type = r.type || "Stock";
          const logo =
            r.__logo ||
            `https://assets.parqet.com/logos/symbol/${upper}?format=png`;
          const item: StockWithWatchlistStatus = {
            symbol: upper,
            name,
            exchange,
            type,
            logo,
            market: "US",
            isInWatchlist: false,
          };
          return item;
        })
        .slice(0, 15);

      return mapped;
    } catch (err) {
      console.error("Error in stock search:", err);
      return [];
    }
  },
);
