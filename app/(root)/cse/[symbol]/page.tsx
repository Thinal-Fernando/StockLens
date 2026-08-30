import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StockLogo from "@/components/StockLogo";
import WatchlistButton from "@/components/WatchlistButton";
import CsePriceRanges from "@/components/cse/CsePriceRanges";
import {
  getCseCompanyInfo,
  getCseDetailedTrades,
  getCseMarketStatus,
  getCseSecurity,
} from "@/lib/actions/cse.actions";
import { isInWatchlist } from "@/lib/actions/watchlist.actions";
import {
  cn,
  cseLogoUrl,
  formatChangePercent,
  formatColomboTime,
  formatCompactNumber,
  formatMarketCap,
  formatPrice,
} from "@/lib/utils";

export default async function CseStockDetails({
  params,
}: StockDetailsPageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = decodeURIComponent(rawSymbol).toUpperCase();

  const [info, security, trades, status, inWatchlist] = await Promise.all([
    getCseCompanyInfo(symbol),
    getCseSecurity(symbol),
    getCseDetailedTrades(symbol),
    getCseMarketStatus(),
    isInWatchlist(symbol),
  ]);

  const details = info?.reqSymbolInfo;

  // Nothing from either feed means the symbol isn't listed on the CSE.
  if (!details && !security) notFound();

  const company = details?.name ?? security?.name ?? symbol;
  const price = details?.lastTradedPrice ?? security?.price ?? undefined;
  const changePercent =
    details?.changePercentage ?? security?.percentageChange ?? undefined;
  const change = details?.change ?? security?.change ?? undefined;
  const isUp = (changePercent ?? 0) >= 0;
  const logo = cseLogoUrl(info?.reqLogo?.path ?? security?.logoUrl);
  const isOpen = status.toLowerCase().includes("open");

  const ranges: CsePriceRange[] = [
    { label: "Today", low: details?.lowTrade, high: details?.hiTrade },
    { label: "This week", low: details?.wtdLowPrice, high: details?.wtdHiPrice },
    {
      label: "This month",
      low: details?.mtdLowPrice,
      high: details?.mtdHiPrice,
    },
    {
      label: "Year to date",
      low: details?.ytdLowPrice,
      high: details?.ytdHiPrice,
    },
    { label: "12 months", low: details?.p12LowPrice, high: details?.p12HiPrice },
    { label: "All time", low: details?.allLowPrice, high: details?.allHiPrice },
  ];

  const stats: { label: string; value: string }[] = [
    { label: "Previous close", value: formatPrice(details?.previousClose ?? security?.previousClose, "LKR") },
    { label: "Open", value: formatPrice(security?.open, "LKR") },
    { label: "Day high", value: formatPrice(details?.hiTrade, "LKR") },
    { label: "Day low", value: formatPrice(details?.lowTrade, "LKR") },
    { label: "Market cap", value: formatMarketCap(details?.marketCap, "LKR") },
    { label: "Turnover today", value: formatMarketCap(details?.tdyTurnover, "LKR") },
    { label: "Volume today", value: formatCompactNumber(details?.tdyShareVolume) },
    { label: "Volume YTD", value: formatCompactNumber(details?.ytdShareVolume) },
    { label: "Shares issued", value: formatCompactNumber(details?.quantityIssued) },
    { label: "Par value", value: formatPrice(details?.parValue, "LKR") },
    {
      label: "Beta (ASPI)",
      value:
        typeof info?.reqSymbolBetaInfo?.triASIBetaValue === "number"
          ? info.reqSymbolBetaInfo.triASIBetaValue.toFixed(2)
          : "—",
    },
    { label: "ISIN", value: details?.isin ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <Link href="/cse" className="cse-back-link">
        <ArrowLeft className="h-4 w-4" />
        Colombo Stock Exchange
      </Link>

      <header className="cse-panel">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <StockLogo src={logo} alt={company} className="h-12 w-12" />
            <div>
              <h1 className="watchlist-title">{company}</h1>
              <p className="text-sm text-ink-3">
                {symbol} · Colombo Stock Exchange
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="cse-card-value">
                  {formatPrice(price, "LKR")}
                </span>
                <span
                  className={cn(
                    "text-lg",
                    isUp ? "text-rising" : "text-falling",
                  )}
                >
                  {typeof change === "number"
                    ? `${change > 0 ? "+" : ""}${change.toFixed(2)}`
                    : "—"}{" "}
                  ({formatChangePercent(changePercent)})
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-3">
                {isOpen ? "Last traded" : "Last session close"} ·{" "}
                {formatColomboTime(security?.lastTradedTime)} Colombo time
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <WatchlistButton
              symbol={symbol}
              company={company}
              market="CSE"
              isInWatchlist={inWatchlist}
            />
          </div>
        </div>
      </header>

      <section className="cse-stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="cse-stat">
            <p className="cse-stat-label">{stat.label}</p>
            <p className="cse-stat-value">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <CsePriceRanges ranges={ranges} current={price} />

        <div className="cse-panel">
          <h3 className="cse-panel-title">Trades this session</h3>

          {trades.length === 0 ? (
            <p className="cse-panel-empty">
              No trades recorded for {symbol} in the current session.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header px-4 py-2 text-sm">Price</th>
                    <th className="table-header px-4 py-2 text-sm">Quantity</th>
                    <th className="table-header px-4 py-2 text-sm">Trades</th>
                    <th className="table-header px-4 py-2 text-sm">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.slice(0, 15).map((trade, i) => {
                    const rowUp = (trade.changePercentage ?? 0) >= 0;
                    return (
                      <tr key={`${trade.price}-${trade.qty}-${i}`} className="table-row">
                        <td className="table-cell px-4 py-2">
                          {formatPrice(trade.price, "LKR")}
                        </td>
                        <td className="table-cell px-4 py-2">
                          {formatCompactNumber(trade.qty)}
                        </td>
                        <td className="table-cell px-4 py-2">
                          {formatCompactNumber(trade.trades)}
                        </td>
                        <td
                          className={cn(
                            "table-cell px-4 py-2",
                            rowUp ? "text-rising" : "text-falling",
                          )}
                        >
                          {formatChangePercent(trade.changePercentage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
