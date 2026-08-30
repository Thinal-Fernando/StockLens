import SearchCommand from "@/components/SearchCommand";
import WatchlistTable from "@/components/WatchlistTable";
import NoticeToInvestors from "@/components/NoticeToInvestors";
import { DepthLegend, DepthRail } from "@/components/chart/DepthRail";
import { CompassRose } from "@/components/chart/Apparatus";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";

export default async function WatchlistPage() {
  const [watchlist, initialStocks] = await Promise.all([
    getWatchlistWithData(),
    searchStocks(),
  ]);

  // Nothing plotted yet. A blank sheet is not an error — it is a chart waiting
  // for its first sounding, and it says so
  if (watchlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-start gap-6 py-16 md:py-24">
        <CompassRose size={56} className="text-rule-strong" />
        <h1 className="chart-title text-[clamp(2rem,5vw,3.25rem)]">
          Nothing tracked yet
        </h1>
        <p className="max-w-[52ch] font-text text-[1.0625rem] leading-relaxed text-ink-2">
          You are not following any companies yet. Add the first one and this
          page starts recording its price, its daily move, what the market
          values the whole company at, and how expensive it is against its
          profits.
        </p>
        <SearchCommand
          renderAs="button"
          label="Add your first company"
          initialStocks={initialStocks}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-14 lg:flex-row lg:gap-12">
      <aside className="w-full shrink-0 lg:sticky lg:top-40 lg:w-60 lg:self-start">
        <DepthRail />
        <div className="mt-8 border-t border-rule-strong pt-5">
          <p className="apparatus mb-2 text-ink">Legend</p>
          <DepthLegend />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="chart-title text-[clamp(2rem,5vw,3.25rem)]">
              Your watchlist
            </h1>
            <p className="mt-2 font-text text-[0.9375rem] italic text-ink-2">
              {watchlist.length}{" "}
              {watchlist.length === 1 ? "company" : "companies"} tracked
            </p>
          </div>
          <SearchCommand
            renderAs="button"
            label="Add a company"
            initialStocks={initialStocks}
          />
        </header>

        <div className="mb-8">
          <NoticeToInvestors watchlist={watchlist} />
        </div>

        <WatchlistTable watchlist={watchlist} />
      </div>
    </div>
  );
}
