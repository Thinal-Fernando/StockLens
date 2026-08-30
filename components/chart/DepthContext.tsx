"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// One number governs the whole page: how big a daily move has to be before
// a holding is worth attention. It bands the watchlist and sets the contours
export type DepthStop = {
  // Daily move, in percent, at or above which a holding counts as active
  threshold: number;
  // What a reader in their first year should understand this to mean
  reading: string;
};

export const DEPTH_STOPS: readonly DepthStop[] = [
  { threshold: 0.5, reading: "Almost everything is moving" },
  { threshold: 1.0, reading: "An ordinary day's drift counts" },
  { threshold: 2.0, reading: "Only a real move counts" },
  { threshold: 3.0, reading: "A notable day, worth reading about" },
  { threshold: 5.0, reading: "Something happened at this company" },
  { threshold: 8.0, reading: "Rare. Earnings, news, or a shock" },
] as const;

// Where the rail sits by default: a real move, not noise
export const DEFAULT_STOP = 2;

type DepthContextValue = {
  stopIndex: number;
  setStopIndex: (index: number) => void;
  threshold: number;
  reading: string;
  // 0–100, handed to the depth field so the seabed rises and falls with it
  depth: number;
  // Which band a daily move falls into: 0 stable, 3 volatile
  bandFor: (changePercent: number) => 0 | 1 | 2 | 3;
};

const DepthContext = createContext<DepthContextValue | null>(null);

export function DepthProvider({
  children,
  initialStop = DEFAULT_STOP,
}: {
  children: ReactNode;
  initialStop?: number;
}) {
  const [stopIndex, setStopIndexState] = useState(initialStop);

  const setStopIndex = useCallback((index: number) => {
    setStopIndexState(Math.min(DEPTH_STOPS.length - 1, Math.max(0, index)));
  }, []);

  const value = useMemo<DepthContextValue>(() => {
    const stop = DEPTH_STOPS[stopIndex];
    const threshold = stop.threshold;

    return {
      stopIndex,
      setStopIndex,
      threshold,
      reading: stop.reading,
      depth: (stopIndex / (DEPTH_STOPS.length - 1)) * 100,
      bandFor: (changePercent: number) => {
        const magnitude = Math.abs(changePercent);
        if (magnitude >= threshold * 2) return 3;
        if (magnitude >= threshold) return 2;
        if (magnitude >= threshold / 2) return 1;
        return 0;
      },
    };
  }, [stopIndex, setStopIndex]);

  return (
    <DepthContext.Provider value={value}>{children}</DepthContext.Provider>
  );
}

export function useDepth(): DepthContextValue {
  const ctx = useContext(DepthContext);
  if (!ctx) {
    throw new Error("useDepth must be used inside a DepthProvider");
  }
  return ctx;
}

// The four depth bands, named the way a chart names them
export const BAND_NAMES = [
  "Stable",
  "Drifting",
  "Active",
  "Volatile",
] as const;

export const BAND_CLASSES = [
  "bg-transparent",
  "bg-shoal-1",
  "bg-shoal-2",
  "bg-shoal-3",
] as const;
