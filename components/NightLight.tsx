"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Night light. A chart table is lit red at night so the navigator keeps their
// dark adaptation
export default function NightLight({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const night = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(night ? "light" : "dark")}
      aria-pressed={mounted ? night : undefined}
      aria-label={night ? "Switch to day light" : "Switch to night light"}
      title={night ? "Day light" : "Night light"}
      className={cn(
        "group flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-shoal-1/60 focus:outline-none focus-visible:outline-1 focus-visible:outline-caution",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        className="text-ink-2 transition-colors group-hover:text-ink"
      >
        {/* A chart lamp: the shade above, the pool of light below. */}
        <path
          d="M8 1.5 L13 6.5 H3 Z"
          fill={night ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path d="M8 6.5 V9" stroke="currentColor" strokeWidth="1.1" />
        <path
          d="M4.5 13.5 Q8 10.5 11.5 13.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity={night ? "0.4" : "1"}
        />
      </svg>
      <span className="apparatus text-ink-2 transition-colors group-hover:text-ink">
        {mounted ? (night ? "Night" : "Day") : "Light"}
      </span>
    </button>
  );
}
