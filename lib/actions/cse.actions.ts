"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import {
  CSE_API_BASE,
  CSE_LOGO_BASE,
  CSE_REQUEST_HEADERS,
} from "@/lib/constants";



const REVALIDATE_LIVE = 60; // prices, indices, movers
const REVALIDATE_REFERENCE = 3600; // company profiles, sector lists

/** POSTs a form-encoded body to a CSE endpoint and parses the JSON response. */
async function postForm<T>(endpoint: string, body?: Record<string, string>) {
  const res = await fetch(`${CSE_API_BASE}/${endpoint}`, {
    method: "POST",
    headers: CSE_REQUEST_HEADERS,
    body: body ? new URLSearchParams(body).toString() : "",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CSE ${endpoint} failed ${res.status}: ${text.slice(0, 200)}`);
  }

  // Several endpoints answer 200 with an empty body when they have nothing.
  const raw = await res.text();
  if (!raw.trim()) return null as T;
  return JSON.parse(raw) as T;
}

function cachedCall<T>(
  endpoint: string,
  fallback: T,
  revalidate: number,
  body?: Record<string, string>,
) {
  const keyParts = [endpoint, ...Object.values(body ?? {})];
  const run = unstable_cache(
    () => postForm<T>(endpoint, body),
    ["cse", ...keyParts],
    { revalidate, tags: ["cse"] },
  );

  return run()
    .then((value) => value ?? fallback)
    .catch((e) => {
      console.error(`CSE ${endpoint} fetch failed`, e);
      return fallback;
    });
}


export const getCseMarketStatus = cache(async (): Promise<string> => {
  const data = await cachedCall<CseMarketStatus | null>(
    "marketStatus",
    null,
    REVALIDATE_LIVE,
  );
  return data?.status ?? "Unknown";
});

export const getCseAspi = cache(async (): Promise<CseIndexData | null> =>
  cachedCall<CseIndexData | null>("aspiData", null, REVALIDATE_LIVE),
);

export const getCseSnp = cache(async (): Promise<CseIndexData | null> =>
  cachedCall<CseIndexData | null>("snpData", null, REVALIDATE_LIVE),
);

export const getCseMarketSummary = cache(
  async (): Promise<CseMarketSummary | null> =>
    cachedCall<CseMarketSummary | null>(
      "marketSummery",
      null,
      REVALIDATE_LIVE,
    ),
);

/**
 * Every listed security in one call. This is the primary feed — search,
 * watchlist hydration and the market table all read from it, so we never loop
 * per-symbol against CSE.
 */
export const getCseTradeSummary = cache(
  async (): Promise<CseTradeSummaryItem[]> => {
    const data = await cachedCall<CseTradeSummaryResponse | null>(
      "tradeSummary",
      null,
      REVALIDATE_LIVE,
    );
    return Array.isArray(data?.reqTradeSummery) ? data.reqTradeSummery : [];
  },
);

export const getCseTopGainers = cache(async (): Promise<CseMover[]> =>
  cachedCall<CseMover[]>("topGainers", [], REVALIDATE_LIVE),
);

//  CSE spells the endpoint "topLooses". Not a typo on our side. 
export const getCseTopLosers = cache(async (): Promise<CseMover[]> =>
  cachedCall<CseMover[]>("topLooses", [], REVALIDATE_LIVE),
);

export const getCseMostActive = cache(async (): Promise<CseActiveTrade[]> =>
  cachedCall<CseActiveTrade[]>("mostActiveTrades", [], REVALIDATE_LIVE),
);

export const getCseSectors = cache(async (): Promise<CseSector[]> =>
  cachedCall<CseSector[]>("allSectors", [], REVALIDATE_REFERENCE),
);


export const getCseCompanyInfo = cache(
  async (symbol: string): Promise<CseCompanyInfo | null> => {
    const sym = symbol?.trim().toUpperCase();
    if (!sym) return null;
    return cachedCall<CseCompanyInfo | null>(
      "companyInfoSummery",
      null,
      REVALIDATE_LIVE,
      { symbol: sym },
    );
  },
);

export const getCseDetailedTrades = cache(
  async (symbol: string): Promise<CseDetailedTrade[]> => {
    const sym = symbol?.trim().toUpperCase();
    if (!sym) return [];
    const data = await cachedCall<CseDetailedTradesResponse | null>(
      "detailedTrades",
      null,
      REVALIDATE_LIVE,
      { symbol: sym },
    );
    return Array.isArray(data?.reqDetailTrades) ? data.reqDetailTrades : [];
  },
);

export const getCseSecurity = cache(
  async (symbol: string): Promise<CseTradeSummaryItem | undefined> => {
    const sym = symbol?.trim().toUpperCase();
    if (!sym) return undefined;
    const all = await getCseTradeSummary();
    return all.find((s) => s.symbol?.toUpperCase() === sym);
  },
);


export const getCseNameLookup = cache(
  async (): Promise<Record<string, string>> => {
    const all = await getCseTradeSummary();
    return Object.fromEntries(
      all.map((s) => [s.symbol?.toUpperCase() ?? "", s.name ?? s.symbol]),
    );
  },
);



export const searchCseStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      const all = await getCseTradeSummary();
      if (all.length === 0) return [];

      const trimmed = typeof query === "string" ? query.trim().toLowerCase() : "";

      const matches = trimmed
        ? all.filter(
            (s) =>
              s.symbol?.toLowerCase().includes(trimmed) ||
              s.name?.toLowerCase().includes(trimmed),
          )
        : [...all]
            .sort((a, b) => (b.turnover ?? 0) - (a.turnover ?? 0))
            .slice(0, 10);

      return matches.slice(0, 15).map((s) => ({
        symbol: s.symbol,
        name: s.name || s.symbol,
        exchange: "CSE",
        type: s.symbol?.includes(".X") ? "Non-Voting" : "Common Stock",
        logo: s.logoUrl ? `${CSE_LOGO_BASE}${s.logoUrl}` : undefined,
        market: "CSE" as const,
        isInWatchlist: false,
      }));
    } catch (err) {
      console.error("Error in CSE stock search:", err);
      return [];
    }
  },
);
