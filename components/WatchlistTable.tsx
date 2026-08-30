"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn, stockHref } from "@/lib/utils";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = (symbol: string, company: string) => {
    setRemoving(symbol);
    startTransition(async () => {
      const res = await removeFromWatchlist(symbol);
      if (res.success) {
        toast.success(`${company} removed from watchlist`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not remove stock");
      }
      setRemoving(null);
    });
  };

  return (
    <div className="watchlist-table overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="table-header-row">
            {WATCHLIST_TABLE_HEADER.map((header) => (
              <th key={header} className="table-header px-4 py-3 text-sm">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {watchlist.map((stock) => {
            const hasChange =
              typeof stock.changePercent === "number" &&
              stock.changeFormatted !== undefined &&
              stock.changeFormatted !== "—";
            const isUp = (stock.changePercent ?? 0) >= 0;

            return (
              <tr key={stock.symbol} className="table-row">
                <td className="table-cell px-4 py-3">
                  <Link
                    href={stockHref(stock.symbol, stock.market)}
                    className="hover:text-yellow-500 transition-colors"
                  >
                    {stock.company}
                  </Link>
                </td>
                <td className="table-cell px-4 py-3 text-gray-400">
                  <span className="inline-flex items-center gap-2">
                    {stock.symbol}
                    {stock.market === "CSE" && (
                      <span className="market-tag">CSE</span>
                    )}
                  </span>
                </td>
                <td className="table-cell px-4 py-3">
                  {stock.priceFormatted ?? "—"}
                </td>
                <td
                  className={cn(
                    "table-cell px-4 py-3",
                    hasChange && (isUp ? "text-green-500" : "text-red-500"),
                  )}
                >
                  {stock.changeFormatted ?? "—"}
                </td>
                <td className="table-cell px-4 py-3">
                  {stock.marketCap ?? "—"}
                </td>
                <td className="table-cell px-4 py-3">{stock.peRatio ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className="add-alert opacity-50"
                    title="Price alerts are coming soon"
                  >
                    Set alert
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleRemove(stock.symbol, stock.company)}
                    disabled={pending && removing === stock.symbol}
                    aria-label={`Remove ${stock.symbol} from watchlist`}
                    className="watchlist-icon-btn disabled:opacity-40"
                  >
                    <Trash2 className="trash-icon" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
