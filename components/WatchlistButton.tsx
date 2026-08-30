"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  market = "US",
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [added, setAdded] = useState<boolean>(isInWatchlist);
  const [pending, startTransition] = useTransition();

  const label = useMemo(() => {
    if (type === "icon")
      return added ? "Remove from watchlist" : "Add to watchlist";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = () => {
    const next = !added;

    // Optimistic flip, reverted if the server action fails.
    setAdded(next);
    onWatchlistChange?.(symbol, next);

    startTransition(async () => {
      const res = next
        ? await addToWatchlist(symbol, company, market)
        : await removeFromWatchlist(symbol);

      if (res.success) {
        toast.success(
          next
            ? `${company} added to watchlist`
            : `${company} removed from watchlist`,
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
        title={label}
        aria-label={label}
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "watchlist-icon-btn disabled:opacity-40",
          added && "watchlist-icon-added",
        )}
      >
        <Star fill={added ? "currentColor" : "none"} className="star-icon" />
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "watchlist-btn",
        added && showTrashIcon && "watchlist-remove",
      )}
    >
      {showTrashIcon && added ? (
        <Trash2 className="trash-icon" />
      ) : (
        <Star fill={added ? "currentColor" : "none"} className="star-icon" />
      )}
      <span>
        {added
          ? `Remove ${company} from Watchlist`
          : `Add ${company} to Watchlist`}
      </span>
    </Button>
  );
}
