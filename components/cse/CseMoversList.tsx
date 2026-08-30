import Link from "next/link";
import {
  cn,
  formatChangePercent,
  formatCompactNumber,
  formatPrice,
  stockHref,
} from "@/lib/utils";

type MoverRow = {
  symbol: string;
  /** Price for gainers/losers; omitted for the most-active list. */
  price?: number;
  changePercentage?: number;
  shareVolume?: number;
};

type CseMoversListProps = {
  title: string;
  rows: MoverRow[];
  /** Symbol -> company name, from the trade summary. */
  names: Record<string, string>;
  emptyLabel: string;
};

/**
 * Compact leaderboard used for top gainers, top losers and most active. Those
 * three endpoints return bare symbols, so names are resolved via `names`.
 */
export default function CseMoversList({
  title,
  rows,
  names,
  emptyLabel,
}: CseMoversListProps) {
  return (
    <div className="cse-panel">
      <h3 className="cse-panel-title">{title}</h3>

      {rows.length === 0 ? (
        <p className="cse-panel-empty">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-rule">
          {rows.slice(0, 8).map((row) => {
            const name = names[row.symbol?.toUpperCase()] ?? row.symbol;
            const isUp = (row.changePercentage ?? 0) >= 0;

            return (
              <li key={row.symbol}>
                <Link
                  href={stockHref(row.symbol, "CSE")}
                  className="cse-mover-row"
                >
                  <div className="min-w-0">
                    <p className="cse-mover-name">{name}</p>
                    <p className="cse-mover-symbol">{row.symbol}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {typeof row.price === "number" && (
                      <p className="text-ink">
                        {formatPrice(row.price, "LKR")}
                      </p>
                    )}
                    {typeof row.changePercentage === "number" && (
                      <p className={cn(isUp ? "text-rising" : "text-falling")}>
                        {formatChangePercent(row.changePercentage)}
                      </p>
                    )}
                    {typeof row.shareVolume === "number" && (
                      <p className="text-sm text-ink-3">
                        {formatCompactNumber(row.shareVolume)} shares
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
