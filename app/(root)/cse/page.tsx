import CseIndexCard from "@/components/cse/CseIndexCard";
import CseMarketTable from "@/components/cse/CseMarketTable";
import CseMoversList from "@/components/cse/CseMoversList";
import {
  getCseAspi,
  getCseMarketStatus,
  getCseMarketSummary,
  getCseMostActive,
  getCseNameLookup,
  getCseSectors,
  getCseSnp,
  getCseTopGainers,
  getCseTopLosers,
  getCseTradeSummary,
} from "@/lib/actions/cse.actions";
import {
  cn,
  formatChangePercent,
  formatCompactNumber,
  formatMarketCap,
} from "@/lib/utils";

export const metadata = {
  title: "Sri Lanka · Colombo Stock Exchange",
  description:
    "Live Colombo Stock Exchange market data — ASPI, S&P SL20, movers and every listed security.",
};

export default async function CsePage() {
  const [
    status,
    aspi,
    snp,
    summary,
    securities,
    gainers,
    losers,
    active,
    sectors,
    names,
  ] = await Promise.all([
    getCseMarketStatus(),
    getCseAspi(),
    getCseSnp(),
    getCseMarketSummary(),
    getCseTradeSummary(),
    getCseTopGainers(),
    getCseTopLosers(),
    getCseMostActive(),
    getCseSectors(),
    getCseNameLookup(),
  ]);

  const isOpen = status.toLowerCase().includes("open");
  const unavailable = securities.length === 0 && !aspi;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="watchlist-title">Colombo Stock Exchange</h1>
          <p className="text-sm text-gray-500">
            Live market data from the CSE · all values in Sri Lankan rupees
          </p>
        </div>
        <span className={cn("cse-status", isOpen && "cse-status-open")}>
          <span
            className={cn("cse-status-dot", isOpen && "cse-status-dot-open")}
            aria-hidden="true"
          />
          {status}
        </span>
      </header>

      {unavailable ? (
        <div className="cse-panel">
          <p className="cse-panel-empty">
            CSE market data is unavailable right now. This section reads directly
            from cse.lk, which occasionally goes offline outside trading hours —
            try again shortly.
          </p>
        </div>
      ) : (
        <>
          {!isOpen && (
            <p className="cse-notice">
              The exchange is closed. Figures below are from the most recent
              trading session.
            </p>
          )}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <CseIndexCard
              title="ASPI"
              subtitle="All Share Price Index"
              data={aspi}
            />
            <CseIndexCard
              title="S&P SL20"
              subtitle="Top 20 by liquidity"
              data={snp}
            />
            <div className="cse-card">
              <h3 className="cse-card-title">Turnover</h3>
              <p className="cse-card-value">
                {formatMarketCap(summary?.tradeVolume, "LKR")}
              </p>
              <p className="cse-card-meta">
                {formatCompactNumber(summary?.shareVolume)} shares traded
              </p>
            </div>
            <div className="cse-card">
              <h3 className="cse-card-title">Trades</h3>
              <p className="cse-card-value">
                {formatCompactNumber(summary?.trades)}
              </p>
              <p className="cse-card-meta">
                {securities.length} securities listed
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <CseMoversList
              title="Top gainers"
              rows={gainers.map((g) => ({
                symbol: g.symbol,
                price: g.price,
                changePercentage: g.changePercentage,
              }))}
              names={names}
              emptyLabel="No gainers in the last session."
            />
            <CseMoversList
              title="Top losers"
              rows={losers.map((l) => ({
                symbol: l.symbol,
                price: l.price,
                changePercentage: l.changePercentage,
              }))}
              names={names}
              emptyLabel="No losers in the last session."
            />
            <CseMoversList
              title="Most active"
              rows={active.map((a) => ({
                symbol: a.symbol,
                shareVolume: a.shareVolume,
              }))}
              names={names}
              emptyLabel="No trading activity recorded."
            />
          </section>

          {sectors.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="watchlist-title">Sector indices</h2>
                <p className="text-sm text-gray-500">
                  CSE publishes sector performance as indices only — it exposes
                  no mapping from an individual security to its sector.
                </p>
              </div>

              <div className="cse-sector-grid">
                {[...sectors]
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((sector) => {
                    const isUp = sector.percentage >= 0;
                    return (
                      <div key={sector.sectorId} className="cse-sector-card">
                        <p className="cse-sector-name">{sector.name}</p>
                        <p className="text-gray-100">
                          {sector.indexValue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p
                          className={cn(
                            "text-sm",
                            isUp ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {formatChangePercent(sector.percentage)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          <CseMarketTable securities={securities} />
        </>
      )}
    </div>
  );
}
