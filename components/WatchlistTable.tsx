"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn, stockHref } from "@/lib/utils";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { BAND_CLASSES, BAND_NAMES, useDepth } from "./chart/DepthContext";
import { Delta, Gloss, Label, Sounding } from "./chart/Apparatus";

// Not a data grid: a ruled table whose left gutter bands each row by how
// far it moved, so the eye lands on the active ones first
const GLOSSES = {
  price: "The most recent trade price for one share.",
  change:
    "How far the price has moved today, as a percentage of where it started.",
  marketCap:
    "What the market thinks the whole company is worth: share price multiplied by the number of shares.",
  peRatio:
    "Price divided by a year of profit per share. Roughly, how many years of today's profit you are paying for one share. High can mean expensive, or it can mean investors expect growth.",
} as const;

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [removing, setRemoving] = useState<string | null>(null);
  const { bandFor, threshold } = useDepth();

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
    <div className="overflow-x-auto border border-rule-strong bg-paper-raised/70 backdrop-blur-[2px]">
      <table className="w-full min-w-208 border-collapse text-left">
        <caption className="sr-only">
          Your watchlist, classified by how far each company has moved today
          against a volatility threshold of {threshold.toFixed(1)} percent.
        </caption>

        <thead>
          <tr className="border-b border-rule-strong bg-paper-sunk/70">
            <th scope="col" className="w-8 px-0 py-3">
              <span className="sr-only">Depth band</span>
            </th>
            <th scope="col" className="px-4 py-3">
              <Label as="span" className="text-ink">
                Company
              </Label>
            </th>
            <th scope="col" className="px-4 py-3">
              <Label as="span" className="text-ink">
                Symbol
              </Label>
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              <span className="apparatus text-ink">
                <Gloss term="Price" note={GLOSSES.price} />
              </span>
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              <span className="apparatus text-ink">
                <Gloss term="Change" note={GLOSSES.change} />
              </span>
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              <span className="apparatus text-ink">
                <Gloss term="Market cap" note={GLOSSES.marketCap} />
              </span>
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              <span className="apparatus text-ink">
                <Gloss term="P/E" note={GLOSSES.peRatio} />
              </span>
            </th>
            <th scope="col" className="w-12 px-4 py-3">
              <span className="sr-only">Remove</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {watchlist.map((stock) => {
            const change = stock.changePercent;
            const hasChange =
              typeof change === "number" &&
              stock.changeFormatted !== undefined &&
              stock.changeFormatted !== "—";
            const band = hasChange ? bandFor(change) : 0;
            const busy = pending && removing === stock.symbol;

            return (
              <tr
                key={stock.symbol}
                className={cn(
                  "group border-b border-rule transition-colors last:border-b-0",
                  busy && "opacity-40",
                )}
              >
                {/* The depth band. The reader's eye lands here first. */}
                <td className="p-0">
                  <span
                    className={cn(
                      "block h-full min-h-12 w-full",
                      BAND_CLASSES[band],
                    )}
                    title={`${BAND_NAMES[band]} — ${
                      hasChange ? stock.changeFormatted : "no data"
                    }`}
                  >
                    <span className="sr-only">{BAND_NAMES[band]}</span>
                  </span>
                </td>

                <td className="px-4 py-3">
                  <Link
                    href={stockHref(stock.symbol, stock.market)}
                    className="font-text text-[0.9375rem] leading-tight text-ink underline-offset-4 transition-colors hover:text-caution hover:underline focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
                  >
                    {stock.company}
                  </Link>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <span
                      data-figure=""
                      className="text-[0.8125rem] tabular-nums text-water"
                    >
                      {stock.symbol}
                    </span>
                    {stock.market === "CSE" ? (
                      <span className="apparatus border border-rule px-1 py-0.5 text-[0.5625rem] text-ink-3">
                        CSE
                      </span>
                    ) : null}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  {stock.priceFormatted ? (
                    <Sounding value={stock.priceFormatted} size="sm" />
                  ) : (
                    <NoReading />
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  {hasChange ? (
                    <span className="inline-flex justify-end">
                      <Delta value={change} percent size="sm" />
                    </span>
                  ) : (
                    <NoReading />
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  {stock.marketCap ? (
                    <Sounding
                      value={stock.marketCap}
                      size="sm"
                      className="text-ink-2"
                    />
                  ) : (
                    <NoReading />
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  {stock.peRatio ? (
                    <Sounding
                      value={stock.peRatio}
                      size="sm"
                      className="text-ink-2"
                    />
                  ) : (
                    <NoReading />
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemove(stock.symbol, stock.company)}
                    disabled={busy}
                    aria-label={`Remove ${stock.symbol} from watchlist`}
                    className="p-1 text-ink-3 opacity-0 transition-colors hover:text-caution focus:outline-none focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-caution group-hover:opacity-100 disabled:cursor-not-allowed"
                  >
                    <StrikeMark />
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

// A sounding that could not be taken. Charts print a blank, not a zero
function NoReading() {
  return (
    <span
      aria-label="No data"
      className="inline-block h-px w-4 -translate-y-1 bg-ink-3"
    />
  );
}

// Struck off the survey
function StrikeMark() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M2.5 2.5 L11.5 11.5" />
        <path d="M11.5 2.5 L2.5 11.5" />
      </g>
    </svg>
  );
}
