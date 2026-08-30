"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import StockLogo from "@/components/StockLogo";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

// Symbol search. You know what you are looking for; this finds it and gets
// out of the way
export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  return (
    <>
      {renderAs === "text" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 px-3 py-2 text-ink-2 transition-colors hover:text-ink focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
        >
          <Dividers />
          <span className="apparatus text-current">{label}</span>
          <kbd
            data-figure=""
            className="hidden border border-rule px-1.5 py-0.5 text-[0.625rem] leading-none text-ink-3 lg:inline-block"
          >
            ⌘K
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="detent detent-filled"
        >
          <Dividers />
          {label}
        </button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="fixed left-1/2 top-16 w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 border border-rule-strong bg-paper-raised p-0 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]"
      >
        <Command className="bg-transparent" shouldFilter={false}>
          <div className="flex items-center gap-3 border-b border-rule-strong px-4">
            <Dividers className="shrink-0 text-ink-3" />
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder="Name or symbol…"
              className="h-14 flex-1 border-0 bg-transparent font-text text-[1.0625rem] italic text-ink placeholder:not-italic placeholder:font-sans placeholder:text-[0.9375rem] placeholder:text-ink-3 focus:ring-0"
            />
            {loading ? (
              <span className="apparatus shrink-0 text-caution">Searching…</span>
            ) : null}
          </div>

          <CommandList className="max-h-104 bg-transparent">
            <div className="flex items-baseline justify-between gap-4 border-b border-rule bg-paper-sunk/60 px-4 py-2">
              <span className="apparatus">
                {isSearchMode ? "Search results" : "Frequently searched"}
              </span>
              <span
                data-figure=""
                className="text-[0.75rem] tabular-nums text-ink-3"
              >
                {displayStocks?.length ?? 0}
              </span>
            </div>

            {!loading && (displayStocks?.length ?? 0) === 0 ? (
              <p className="px-4 py-10 text-center font-text text-[0.9375rem] italic text-ink-2">
                {isSearchMode
                  ? "No symbol matches that name."
                  : "No symbols available."}
              </p>
            ) : (
              <ul>
                {displayStocks?.map((stock) => (
                  <li key={stock.symbol}>
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      onClick={handleSelectStock}
                      className="flex w-full items-center gap-3 border-b border-rule px-4 py-3 transition-colors last:border-b-0 hover:bg-shoal-1/70 focus:outline-none focus-visible:bg-shoal-1"
                    >
                      <StockLogo src={stock.logo} alt={stock.name} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-text text-[0.9375rem] leading-tight text-ink">
                          {stock.name}
                        </span>
                        <span className="apparatus mt-1 block text-ink-3">
                          {stock.exchange}
                          {stock.type ? ` · ${stock.type}` : ""}
                        </span>
                      </span>
                      <span
                        data-figure=""
                        className="shrink-0 text-[0.8125rem] tabular-nums text-water"
                      >
                        {stock.symbol}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

// Dividers: the pair of compasses a navigator steps distance off with
function Dividers({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M8 2 L3.5 13.5" />
        <path d="M8 2 L12.5 13.5" />
        <path d="M5.6 8.2 L10.4 8.2" />
      </g>
      <circle cx="8" cy="2" r="1.4" fill="currentColor" />
    </svg>
  );
}
