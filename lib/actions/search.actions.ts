"use server";

import { cache } from "react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { searchCseStocks } from "@/lib/actions/cse.actions";

/**
 * One search across both markets, so the command palette makes a single round
 * trip. US (Finnhub) and CSE are fetched in parallel and each failure is
 * already contained by its own action, which returns `[]`.
 *
 * Results interleave rather than concatenate: a straight concat would bury
 * every CSE match under fifteen US ones.
 */
export const searchAllStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    const [us, cse] = await Promise.all([
      searchStocks(query),
      searchCseStocks(query),
    ]);

    const merged: StockWithWatchlistStatus[] = [];
    const limit = Math.max(us.length, cse.length);

    for (let i = 0; i < limit; i++) {
      if (us[i]) merged.push(us[i]);
      if (cse[i]) merged.push(cse[i]);
    }

    return merged.slice(0, 20);
  },
);
