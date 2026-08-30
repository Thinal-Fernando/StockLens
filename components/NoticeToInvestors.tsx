"use client";

import Link from "next/link";
import { useDepth } from "./chart/DepthContext";

// A short bulletin about the watchlist in front of it. States only what can
// be counted from the data on screen — never an unprovable personalisation
export default function NoticeToInvestors({
  watchlist,
}: {
  watchlist: StockWithData[];
}) {
  const { threshold, bandFor } = useDepth();

  const readable = watchlist.filter(
    (stock) => typeof stock.changePercent === "number",
  );
  const crossed = readable.filter(
    (stock) => bandFor(stock.changePercent as number) >= 2,
  );

  if (readable.length === 0) return null;

  const quiet = crossed.length === 0;

  return (
    <aside
      aria-label="Watchlist alert"
      className="overprint flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
    >
      <span className="apparatus shrink-0 text-caution">Alert</span>

      <p className="font-text text-[0.9375rem] leading-snug text-ink">
        {quiet ? (
          <>
            Nothing on your watchlist has moved more than{" "}
            <Figure>{threshold.toFixed(1)}%</Figure> today. No action needed.
          </>
        ) : (
          <>
            <Figure>{crossed.length}</Figure> of{" "}
            <Figure>{readable.length}</Figure>{" "}
            {readable.length === 1 ? "company" : "companies"} on your watchlist
            moved more than <Figure>{threshold.toFixed(1)}%</Figure> today
            {crossed.length <= 4 ? (
              <>
                {" — "}
                {crossed.map((stock, index) => (
                  <span key={stock.symbol}>
                    {index > 0 ? ", " : ""}
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      className="text-caution underline underline-offset-4 transition-opacity hover:opacity-70"
                    >
                      {stock.symbol}
                    </Link>
                  </span>
                ))}
              </>
            ) : null}
            .
          </>
        )}
      </p>
    </aside>
  );
}

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <span data-figure="" className="tabular-nums text-caution">
      {children}
    </span>
  );
}
