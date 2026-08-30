"use client";

import type { ReactNode } from "react";
import DepthField from "./DepthField";
import { DepthProvider, useDepth } from "./DepthContext";

// The sheet everything is printed on. The depth field is fixed behind the whole
// application, not scrolled with it
function Sheet({ seed }: { seed: number }) {
  const { depth } = useDepth();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper"
    >
      <DepthField depth={depth} seed={seed} />

      {/* The graticule: the chart's measured grid, ruled over the survey. */}
      <div className="graticule absolute inset-0 opacity-40" />

      {/* Light falling on a chart table, from the upper left. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 0%, transparent 0%, transparent 42%, color-mix(in oklab, var(--ink) 12%, transparent) 100%)",
        }}
      />

      {/* Paper tooth. The sheet is fibrous, not a flat fill. */}
      <div className="tooth absolute inset-0" />
    </div>
  );
}

export default function ChartShell({
  children,
  seed = 20260830,
}: {
  children: ReactNode;
  seed?: number;
}) {
  return (
    <DepthProvider>
      <Sheet seed={seed} />
      {children}
    </DepthProvider>
  );
}
