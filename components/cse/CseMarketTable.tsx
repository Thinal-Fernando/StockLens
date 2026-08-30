"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import StockLogo from "@/components/StockLogo";
import { CSE_MARKET_TABLE_HEADER, type CseSortKey } from "@/lib/constants";
import {
  cn,
  cseLogoUrl,
  formatChangePercent,
  formatCompactNumber,
  formatMarketCap,
  formatPrice,
  stockHref,
} from "@/lib/utils";

/** Column header -> the field it sorts on. `null` means the column is static. */
const SORT_BY_HEADER: Record<string, CseSortKey | null> = {
  Company: "name",
  Symbol: null,
  Price: "price",
  Change: "percentageChange",
  "High / Low": null,
  Volume: "sharevolume",
  Turnover: "turnover",
  "Market Cap": "marketCap",
};

export default function CseMarketTable({ securities }: CseMarketTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<CseSortKey>("turnover");
  const [ascending, setAscending] = useState(false);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = needle
      ? securities.filter(
          (s) =>
            s.symbol?.toLowerCase().includes(needle) ||
            s.name?.toLowerCase().includes(needle),
        )
      : securities;

    const direction = ascending ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sortKey === "name") {
        return (a.name ?? "").localeCompare(b.name ?? "") * direction;
      }
      // Securities that did not trade today sort last either way.
      const left = a[sortKey];
      const right = b[sortKey];
      const leftValue = typeof left === "number" ? left : Number.NEGATIVE_INFINITY;
      const rightValue =
        typeof right === "number" ? right : Number.NEGATIVE_INFINITY;
      return (leftValue - rightValue) * direction;
    });
  }, [securities, query, sortKey, ascending]);

  const handleSort = (key: CseSortKey) => {
    if (key === sortKey) {
      setAscending((v) => !v);
      return;
    }
    setSortKey(key);
    // Names read best A–Z; numbers read best largest-first.
    setAscending(key === "name");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="watchlist-title">All listed securities</h2>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by company or symbol…"
          aria-label="Filter securities"
          className="cse-filter-input"
        />
      </div>

      <p className="text-sm text-ink-3">
        {rows.length} of {securities.length} securities
      </p>

      <div className="watchlist-table overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="table-header-row">
              {CSE_MARKET_TABLE_HEADER.map((header) => {
                const key = SORT_BY_HEADER[header];
                const isSorted = key !== null && key === sortKey;

                return (
                  <th key={header} className="table-header px-4 py-3 text-sm">
                    {key ? (
                      <button
                        type="button"
                        onClick={() => handleSort(key)}
                        className="inline-flex items-center gap-1 cursor-pointer hover:text-caution transition-colors"
                        aria-label={`Sort by ${header}`}
                      >
                        {header}
                        {isSorted &&
                          (ascending ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          ))}
                      </button>
                    ) : (
                      header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={CSE_MARKET_TABLE_HEADER.length}
                  className="px-4 py-8 text-center text-ink-3"
                >
                  No securities match “{query}”.
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                const price = s.price ?? s.closingPrice ?? undefined;
                const hasChange = typeof s.percentageChange === "number";
                const isUp = (s.percentageChange ?? 0) >= 0;

                return (
                  <tr key={s.symbol} className="table-row">
                    <td className="table-cell px-4 py-3">
                      <Link
                        href={stockHref(s.symbol, "CSE")}
                        className="flex items-center gap-3 hover:text-caution transition-colors"
                      >
                        <StockLogo
                          src={cseLogoUrl(s.logoUrl)}
                          alt={s.name ?? s.symbol}
                        />
                        <span className="truncate">{s.name}</span>
                      </Link>
                    </td>
                    <td className="table-cell px-4 py-3 text-ink-2">
                      {s.symbol}
                    </td>
                    <td className="table-cell px-4 py-3">
                      {formatPrice(price, "LKR")}
                    </td>
                    <td
                      className={cn(
                        "table-cell px-4 py-3",
                        hasChange && (isUp ? "text-rising" : "text-falling"),
                      )}
                    >
                      {formatChangePercent(s.percentageChange)}
                    </td>
                    <td className="table-cell px-4 py-3 text-ink-2">
                      {formatPrice(s.high, "LKR")} / {formatPrice(s.low, "LKR")}
                    </td>
                    <td className="table-cell px-4 py-3">
                      {formatCompactNumber(s.sharevolume)}
                    </td>
                    <td className="table-cell px-4 py-3">
                      {formatMarketCap(s.turnover, "LKR")}
                    </td>
                    <td className="table-cell px-4 py-3">
                      {formatMarketCap(s.marketCap, "LKR")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
