"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [added, setAdded] = useState<boolean>(isInWatchlist);

  const label = useMemo(() => {
    if (type === "icon") return added ? "Remove from watchlist" : "Add to watchlist";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = () => {
    const next = !added;
    setAdded(next);
    onWatchlistChange?.(symbol, next);
  };

  if (type === "icon") {
    return (
      <button
        title={label}
        aria-label={label}
        onClick={handleClick}
        className={cn("watchlist-icon-btn", added && "watchlist-icon-added")}
      >
        <Star fill={added ? "currentColor" : "none"} className="star-icon" />
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className={cn("watchlist-btn", added && showTrashIcon && "watchlist-remove")}
    >
      {showTrashIcon && added ? (
        <Trash2 className="trash-icon" />
      ) : (
        <Star fill={added ? "currentColor" : "none"} className="star-icon" />
      )}
      <span>{added ? `Remove ${company} from Watchlist` : `Add ${company} to Watchlist`}</span>
    </Button>
  );
}
