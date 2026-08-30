"use client";

import { memo, useMemo } from "react";
import { useTheme } from "next-themes";
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";
import { Label } from "./chart/Apparatus";

// A mounted panel. The market data is borrowed — TradingView draws it inside an
// iframe whose DOM is not ours

// The plate inks, in the flat hex TradingView's config accepts
const PLATE = {
  light: {
    background: "#faf6ec",
    grid: "#e2dccd",
    gridLine: "rgba(20, 24, 26, 0.10)",
    scaleFont: "#5b6b72",
    rising: "#2c6b52",
    falling: "#9c4526",
    fill: "rgba(46, 110, 142, 0.14)",
    fillFoot: "rgba(46, 110, 142, 0)",
    active: "rgba(31, 99, 214, 0.08)",
  },
  dark: {
    background: "#1a2530",
    grid: "#2b3a48",
    gridLine: "rgba(237, 231, 217, 0.12)",
    // White, taken from the night ink token so it belongs to the surface rather
    // than punching a pure #fff hole in it
    scaleFont: "#ede7d9",
    rising: "#5fc79b",
    falling: "#e08a63",
    fill: "rgba(130, 178, 204, 0.18)",
    fillFoot: "rgba(130, 178, 204, 0)",
    active: "rgba(255, 107, 172, 0.12)",
  },
} as const;

interface TradingViewWidgetProps {
  title?: string;
  // The panel's index letter, printed at the right of the title band
  index?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

function TradingViewWidget({
  title,
  index,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "dark" ? "dark" : "light";

  // Re-solved when the light changes, which remounts the embed on the new plate
  const themedConfig = useMemo(() => {
    const plate = PLATE[mode];
    const next: Record<string, unknown> = { ...config };

    // The embed's own text and chrome
    if ("colorTheme" in next) next.colorTheme = mode;
    if ("theme" in next) next.theme = mode;

    // Every colour we pass explicitly has to be replaced too, or the day values
    // ride into the night plate
    const overrides: Record<string, string> = {
      backgroundColor: plate.background,
      gridColor: plate.grid,
      gridLineColor: plate.gridLine,
      scaleFontColor: plate.scaleFont,
      plotLineColorGrowing: plate.rising,
      plotLineColorFalling: plate.falling,
      belowLineFillColorGrowing: plate.fill,
      belowLineFillColorFalling: plate.fill,
      belowLineFillColorGrowingBottom: plate.fillFoot,
      belowLineFillColorFallingBottom: plate.fillFoot,
      symbolActiveColor: plate.active,
    };

    for (const [key, value] of Object.entries(overrides)) {
      if (key in next) next[key] = value;
    }

    return next;
  }, [config, mode]);

  const containerRef = useTradingViewWidget(scriptUrl, themedConfig, height);

  return (
    <section className="flex w-full flex-col border border-rule-strong bg-paper-raised/70 backdrop-blur-[2px]">
      {title ? (
        <header className="flex items-baseline justify-between gap-4 border-b border-rule px-4 py-2.5">
          <Label as="div" className="text-ink">
            {title}
          </Label>
          {index ? (
            <span
              data-figure=""
              className="shrink-0 text-[0.75rem] tabular-nums text-ink-3"
            >
              {index}
            </span>
          ) : null}
        </header>
      ) : null}

      {/* The panel needs a definite height: the embed's own widget div is
          height:100%, so an auto-height parent collapses it to nothing. */}
      <div
        key={mode}
        className={cn("tradingview-widget-container", className)}
        ref={containerRef}
        style={{ height }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        />
      </div>
    </section>
  );
}

export default memo(TradingViewWidget);
