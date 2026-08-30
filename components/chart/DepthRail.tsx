"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  BAND_CLASSES,
  BAND_NAMES,
  DEPTH_STOPS,
  useDepth,
} from "./DepthContext";

export function DepthRail({ className }: { className?: string }) {
  const { stopIndex, setStopIndex, threshold, reading } = useDepth();
  const listRef = useRef<HTMLDivElement | null>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const step = keys[event.key];
    if (step !== undefined) {
      event.preventDefault();
      const next = Math.min(
        DEPTH_STOPS.length - 1,
        Math.max(0, stopIndex + step),
      );
      setStopIndex(next);
      const buttons = listRef.current?.querySelectorAll("button");
      buttons?.[next]?.focus();
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setStopIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setStopIndex(DEPTH_STOPS.length - 1);
    }
  };

  return (
    <div className={cn("select-none", className)}>
      <p className="apparatus mb-1 text-ink">Volatility threshold</p>
      <p className="mb-4 max-w-60 font-text text-[0.8125rem] italic leading-snug text-ink-2">
        How big a day&rsquo;s move has to be before a company is worth your
        attention.
      </p>

      <div
        ref={listRef}
        role="radiogroup"
        aria-label="Volatility threshold: minimum daily move"
        onKeyDown={onKeyDown}
        className="relative flex flex-row flex-wrap border-t border-rule-strong sm:flex-col sm:flex-nowrap sm:border-l sm:border-t-0"
      >
        {DEPTH_STOPS.map((stop, index) => {
          const selected = index === stopIndex;
          return (
            <button
              key={stop.threshold}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setStopIndex(index)}
              title={stop.reading}
              className={cn(
                // Three across on a phone, one column from sm up
                "group relative flex basis-1/3 grow items-center gap-2.5 py-2 pl-3 pr-2 text-left transition-colors duration-200 sm:basis-auto",
                "hover:bg-shoal-1/60 focus:outline-none focus-visible:outline-1 focus-visible:outline-caution",
              )}
            >
              {/* The detent: hairline at rest, filled when set. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 transition-colors",
                  selected ? "bg-caution" : "bg-rule-strong",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 shrink-0 border transition-colors",
                  selected
                    ? "border-caution bg-caution"
                    : "border-rule-strong bg-transparent group-hover:border-ink-2",
                )}
              />
              <span
                data-figure=""
                className={cn(
                  "text-[0.8125rem] tabular-nums transition-colors",
                  selected ? "text-ink" : "text-ink-3 group-hover:text-ink-2",
                )}
              >
                {stop.threshold.toFixed(1)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* The readout. A real quantity, in the reader's own unit. */}
      <div className="mt-4 border-t border-rule-strong pt-3">
        <p className="apparatus mb-1.5">Current threshold</p>
        <p
          data-figure=""
          className="text-xl tabular-nums leading-none text-ink"
        >
          {threshold.toFixed(1)}%
          <span className="ml-1.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-3">
            daily move
          </span>
        </p>
        <p className="mt-2 max-w-60 font-text text-[0.8125rem] italic leading-snug text-water">
          {reading}
        </p>
      </div>
    </div>
  );
}

// The legend. Every chart carries one, and every symbol on the sheet is defined
// in it
export function DepthLegend({ className }: { className?: string }) {
  const { threshold } = useDepth();

  const bounds = [
    `under ${(threshold / 2).toFixed(1)}%`,
    `${(threshold / 2).toFixed(1)}–${threshold.toFixed(1)}%`,
    `${threshold.toFixed(1)}–${(threshold * 2).toFixed(1)}%`,
    `over ${(threshold * 2).toFixed(1)}%`,
  ];

  const meanings = [
    "Quiet. Nothing today needs you.",
    "Starting to move.",
    "A real move. Worth reading the news.",
    "A large move. Find out why before acting.",
  ];

  return (
    <dl className={cn("space-y-0", className)}>
      {BAND_NAMES.map((name, index) => (
        <div
          key={name}
          className="flex items-start gap-3 border-b border-rule py-2.5 last:border-b-0"
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-4 shrink-0 border border-rule-strong",
              BAND_CLASSES[index],
            )}
          />
          <div className="min-w-0 flex-1">
            <dt className="flex flex-wrap items-baseline gap-x-2">
              <span className="apparatus text-ink">{name}</span>
              <span
                data-figure=""
                className="text-[0.75rem] tabular-nums text-ink-3"
              >
                {bounds[index]}
              </span>
            </dt>
            <dd className="mt-0.5 font-text text-[0.8125rem] leading-snug text-ink-2">
              {meanings[index]}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
