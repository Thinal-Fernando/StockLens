import { Star } from "lucide-react";
import SearchCommand from "@/components/SearchCommand";
import WatchlistTable from "@/components/WatchlistTable";
import { searchAllStocks } from "@/lib/actions/search.actions";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";

export default async function WatchlistPage() {
  const [watchlist, initialStocks] = await Promise.all([
    getWatchlistWithData(),
    searchAllStocks(),
  ]);

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-empty-container flex">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Search for a stock and add it to your watchlist to track its price,
            daily change, market cap and P/E ratio all in one place.
          </p>
          <SearchCommand
            renderAs="button"
            label="Add stock"
            initialStocks={initialStocks}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="watchlist space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="watchlist-title">Watchlist</h1>
          <p className="text-sm text-gray-500">
            {watchlist.length} {watchlist.length === 1 ? "stock" : "stocks"}{" "}
            tracked
          </p>
        </div>
        <SearchCommand
          renderAs="button"
          label="Add stock"
          initialStocks={initialStocks}
        />
      </div>

      <WatchlistTable watchlist={watchlist} />
    </section>
  );
}
