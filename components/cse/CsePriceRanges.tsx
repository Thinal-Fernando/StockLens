import { formatPrice } from "@/lib/utils";

type CsePriceRangesProps = {
  ranges: CsePriceRange[];
  /** Marker position on each bar. Usually the last traded price. */
  current?: number | null;
};

/**
 * CSE exposes no historical OHLC series (its `chartData` and
 * `companyChartDataByStock` endpoints return empty), and TradingView carries no
 * Colombo symbols — so instead of a price chart we plot the real high/low bands
 * `companyInfoSummery` does return, with the current price marked on each.
 */
export default function CsePriceRanges({
  ranges,
  current,
}: CsePriceRangesProps) {
  const usable = ranges.filter(
    (r) =>
      typeof r.low === "number" &&
      typeof r.high === "number" &&
      Number.isFinite(r.low) &&
      Number.isFinite(r.high),
  );

  if (usable.length === 0) {
    return (
      <div className="cse-panel">
        <h3 className="cse-panel-title">Price ranges</h3>
        <p className="cse-panel-empty">
          No range data published for this security.
        </p>
      </div>
    );
  }

  return (
    <div className="cse-panel">
      <h3 className="cse-panel-title">Price ranges</h3>
      <p className="mb-4 text-sm text-gray-500">
        CSE publishes no intraday price history, so these are the exchange&apos;s
        own high/low bands with the last traded price marked.
      </p>

      <ul className="space-y-5">
        {usable.map((range) => {
          const low = range.low as number;
          const high = range.high as number;
          const span = high - low;

          // A flat band (no movement in the period) has no meaningful position;
          // centre the marker rather than dividing by zero.
          const position =
            span > 0 && typeof current === "number"
              ? Math.min(100, Math.max(0, ((current - low) / span) * 100))
              : 50;
          const showMarker = typeof current === "number" && span > 0;

          return (
            <li key={range.label}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="text-gray-400">{range.label}</span>
                <span className="text-gray-500">
                  {formatPrice(low, "LKR")} – {formatPrice(high, "LKR")}
                </span>
              </div>
              <div className="cse-range-track">
                {showMarker && (
                  <span
                    className="cse-range-marker"
                    style={{ left: `${position}%` }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
