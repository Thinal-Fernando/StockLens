"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { connectionToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { fetchJSON } from "@/lib/actions/finnhub.actions";
import { getCseTradeSummary } from "@/lib/actions/cse.actions";
import {
  formatChangePercent,
  formatMarketCap,
  formatMarketCapValue,
  formatPrice,
} from "@/lib/utils";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const finnhubToken = () =>
  process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

const currentUserId = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
};

type ActionResult = { success: boolean; error?: string };

/** All symbols the signed-in user is tracking (used to flag search results / buttons). */
export const getWatchlistSymbols = async (): Promise<string[]> => {
  const userId = await currentUserId();
  if (!userId) return [];
  try {
    await connectionToDatabase();
    const rows = await Watchlist.find({ userId }, { symbol: 1, _id: 0 }).lean<
      { symbol: string }[]
    >();
    return rows.map((r) => r.symbol);
  } catch (e) {
    console.error("getWatchlistSymbols failed", e);
    return [];
  }
};

export const isInWatchlist = async (symbol: string): Promise<boolean> => {
  const userId = await currentUserId();
  if (!userId || !symbol) return false;
  try {
    await connectionToDatabase();
    const exists = await Watchlist.exists({
      userId,
      symbol: symbol.trim().toUpperCase(),
    });
    return Boolean(exists);
  } catch (e) {
    console.error("isInWatchlist failed", e);
    return false;
  }
};

export const addToWatchlist = async (
  symbol: string,
  company: string,
  market: Market = "US",
): Promise<ActionResult> => {
  const userId = await currentUserId();
  if (!userId) return { success: false, error: "You need to be signed in." };

  const sym = symbol?.trim().toUpperCase();
  if (!sym) return { success: false, error: "Invalid symbol." };

  try {
    await connectionToDatabase();
    await Watchlist.updateOne(
      { userId, symbol: sym },
      {
        $setOnInsert: {
          userId,
          symbol: sym,
          company: company?.trim() || sym,
          market,
          addedAt: new Date(),
        },
      },
      { upsert: true },
    );
    revalidatePath("/watchlist");
    return { success: true };
  } catch (e) {
    console.error("addToWatchlist failed", e);
    return { success: false, error: "Could not add to watchlist." };
  }
};

export const removeFromWatchlist = async (
  symbol: string,
): Promise<ActionResult> => {
  const userId = await currentUserId();
  if (!userId) return { success: false, error: "You need to be signed in." };

  try {
    await connectionToDatabase();
    await Watchlist.deleteOne({
      userId,
      symbol: symbol?.trim().toUpperCase(),
    });
    revalidatePath("/watchlist");
    return { success: true };
  } catch (e) {
    console.error("removeFromWatchlist failed", e);
    return { success: false, error: "Could not remove from watchlist." };
  }
};

/** The user's watchlist, enriched with live quote / profile / valuation data. */
export const getWatchlistWithData = async (): Promise<StockWithData[]> => {
  const userId = await currentUserId();
  if (!userId) return [];

  try {
    await connectionToDatabase();
    const rows = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean<
      { symbol: string; company: string; market?: Market; addedAt: Date }[]
    >();

    const token = finnhubToken();

    // CSE rows are all served by one market-wide call, so fetch it once up
    // front rather than per row — and only when a CSE row actually exists.
    const hasCse = rows.some((r) => r.market === "CSE");
    const cseBySymbol = new Map<string, CseTradeSummaryItem>();
    if (hasCse) {
      for (const item of await getCseTradeSummary()) {
        if (item.symbol) cseBySymbol.set(item.symbol.toUpperCase(), item);
      }
    }

    return await Promise.all(
      rows.map(async (row): Promise<StockWithData> => {
        const market: Market = row.market === "CSE" ? "CSE" : "US";
        const base: StockWithData = {
          userId,
          symbol: row.symbol,
          company: row.company,
          market,
          addedAt: row.addedAt,
        };

        if (market === "CSE") {
          const item = cseBySymbol.get(row.symbol.toUpperCase());
          if (!item) return base;

          const currentPrice = item.price ?? item.closingPrice ?? undefined;
          const changePercent = item.percentageChange ?? undefined;

          return {
            ...base,
            currentPrice: currentPrice ?? undefined,
            changePercent: changePercent ?? undefined,
            priceFormatted: formatPrice(currentPrice, "LKR"),
            changeFormatted: formatChangePercent(changePercent),
            marketCap: formatMarketCap(item.marketCap, "LKR"),
            // CSE publishes no earnings multiple in this feed.
            peRatio: "—",
          };
        }

        if (!token) return base;

        try {
          const [quote, profile, financials] = await Promise.all([
            fetchJSON<QuoteData>(
              `${FINNHUB_BASE_URL}/quote?symbol=${row.symbol}&token=${token}`,
              60,
            ),
            fetchJSON<ProfileData>(
              `${FINNHUB_BASE_URL}/stock/profile2?symbol=${row.symbol}&token=${token}`,
              3600,
            ),
            fetchJSON<FinancialsData>(
              `${FINNHUB_BASE_URL}/stock/metric?symbol=${row.symbol}&metric=all&token=${token}`,
              3600,
            ),
          ]);

          const currentPrice = quote?.c;
          const changePercent = quote?.dp;
          const pe =
            financials?.metric?.peTTM ??
            financials?.metric?.peBasicExclExtraTTM;

          return {
            ...base,
            currentPrice,
            changePercent,
            priceFormatted: formatPrice(currentPrice),
            changeFormatted: formatChangePercent(changePercent),
            marketCap: formatMarketCapValue(profile?.marketCapitalization),
            peRatio:
              typeof pe === "number" && Number.isFinite(pe)
                ? pe.toFixed(2)
                : "—",
          };
        } catch (e) {
          console.error("watchlist data fetch failed for", row.symbol, e);
          return base;
        }
      }),
    );
  } catch (e) {
    console.error("getWatchlistWithData failed", e);
    return [];
  }
};
