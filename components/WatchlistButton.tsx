"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

// Add or remove a company. The mark is hollow until it is on your list,
// filled once it is, at both sizes
function Station({ plotted, size = 16 }: { plotted: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="8"
        cy="8"
        r="6.4"
        fill={plotted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M8 0.6 V3.2 M8 12.8 V15.4 M0.6 8 H3.2 M12.8 8 H15.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [added, setAdded] = useState<boolean>(isInWatchlist);
  const [pending, startTransition] = useTransition();

  // The control names the action it performs, not the state it is in
  const label = useMemo(
    () =>
      added
        ? `Remove ${company} from your watchlist`
        : `Add ${company} to your watchlist`,
    [added, company],
  );

  const handleClick = () => {
    const next = !added;

    // Optimistic flip, reverted if the server action fails
    setAdded(next);
    onWatchlistChange?.(symbol, next);

    startTransition(async () => {
      const res = next
        ? await addToWatchlist(symbol, company)
        : await removeFromWatchlist(symbol);

      if (res.success) {
        toast.success(
          next
            ? `${company} added to your watchlist`
            : `${company} removed from your watchlist`,
        );
      } else {
        setAdded(!next);
        onWatchlistChange?.(symbol, !next);
        toast.error(res.error ?? "Something went wrong");
      }
    });
  };

  if (type === "icon") {
    return (
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-pressed={added}
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "p-1 transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-caution disabled:opacity-40",
          added ? "text-caution" : "text-ink-3 hover:text-ink",
        )}
      >
        <Station plotted={added} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={added}
      className={cn(
        "detent w-full justify-between px-4",
        added && "detent-caution",
        showTrashIcon && added && "detent-caution",
      )}
    >
      <span className="flex items-center gap-2.5">
        <Station plotted={added} size={14} />
        {added ? "Remove from watchlist" : "Add to watchlist"}
      </span>
      <span
        data-figure=""
        className="text-[0.75rem] tabular-nums opacity-60"
      >
        {symbol}
      </span>
    </button>
  );
}
