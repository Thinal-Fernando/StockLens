import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// The small marks that make the chart readable: labels, rules, figures,
// direction marks, and the gloss

// Pearl-scale legend lettering. The chart's smallest register
export function Label({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "dt" | "th" | "p";
}) {
  return <Tag className={cn("apparatus", className)}>{children}</Tag>;
}

// A heading with the rule run out to the margin, the way a chart panel is titled
export function RuledHeading({
  children,
  aside,
  className,
}: {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-4 pb-3", className)}>
      <h2 className="apparatus-lg shrink-0 text-ink">{children}</h2>
      <span
        aria-hidden="true"
        className="h-px flex-1 -translate-y-0.5 bg-rule-strong"
      />
      {aside ? <div className="shrink-0 apparatus">{aside}</div> : null}
    </div>
  );
}

// A figure printed on the chart. Always tabular and lining, so a column of
// them compares straight down the page
export function Sounding({
  value,
  prefix,
  suffix,
  size = "md",
  className,
}: {
  value: string | number;
  prefix?: string;
  suffix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "text-[0.8125rem]",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-[clamp(2.25rem,5vw,3.75rem)]",
  };
  return (
    <span
      data-figure=""
      className={cn(
        "tabular-nums tracking-tight text-ink",
        sizes[size],
        className,
      )}
    >
      {prefix ? (
        <span className="text-ink-3">{prefix}</span>
      ) : null}
      {value}
      {suffix ? (
        <span className="ml-0.5 text-[0.7em] text-ink-3">{suffix}</span>
      ) : null}
    </span>
  );
}

// Direction of travel. Hue never carries it alone — every delta ships with
// a sign and a drawn mark
export function Delta({
  value,
  percent,
  size = "md",
  className,
}: {
  value: number;
  percent?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const rising = value > 0;
  const flat = value === 0;
  const sizes = { sm: "text-[0.8125rem]", md: "text-base", lg: "text-xl" };

  return (
    <span
      data-figure=""
      className={cn(
        "inline-flex items-center gap-1.5 tabular-nums",
        sizes[size],
        flat ? "text-ink-2" : rising ? "text-rising" : "text-falling",
        className,
      )}
    >
      <Bearing direction={flat ? "flat" : rising ? "up" : "down"} />
      <span>
        {rising ? "+" : flat ? "" : "−"}
        {Math.abs(value).toFixed(2)}
        {percent ? "%" : ""}
      </span>
    </span>
  );
}

// Drawn, not a glyph: filled triangle up, hollow down, bar for flat
export function Bearing({
  direction,
  className,
}: {
  direction: "up" | "down" | "flat";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 10 10"
      width="9"
      height="9"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {direction === "up" ? (
        <path d="M5 1 L9.5 8.5 L0.5 8.5 Z" fill="currentColor" />
      ) : direction === "down" ? (
        <path
          d="M5 9 L0.5 1.5 L9.5 1.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ) : (
        <path d="M0.5 5 H9.5" stroke="currentColor" strokeWidth="1.4" />
      )}
    </svg>
  );
}

// The gloss. A first-year investor meets "P/E" and needs it explained in place,
// not in a help centre
export function Gloss({
  term,
  note,
  className,
}: {
  term: ReactNode;
  note: string;
  className?: string;
}) {
  return (
    <span className={cn("group/gloss relative inline-block", className)}>
      <button
        type="button"
        className="cursor-help border-b border-dotted border-caution/70 pb-px text-left focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
        aria-describedby={undefined}
      >
        {term}
        <svg
          viewBox="0 0 8 8"
          width="6"
          height="6"
          aria-hidden="true"
          className="mb-1.5 ml-1 inline-block text-caution"
        >
          <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
            <path d="M4 0.8 V7.2" />
            <path d="M1.23 2.4 L6.77 5.6" />
            <path d="M1.23 5.6 L6.77 2.4" />
          </g>
        </svg>
      </button>
      <span
        role="note"
        className="pointer-events-none absolute left-0 top-[calc(100%+0.5rem)] z-40 w-56 translate-y-1 border border-caution bg-paper-raised p-3 opacity-0 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-200 ease-out group-hover/gloss:translate-y-0 group-hover/gloss:opacity-100 group-focus-within/gloss:translate-y-0 group-focus-within/gloss:opacity-100"
      >
        <span className="apparatus mb-1 block text-caution">Note</span>
        <span className="font-text text-[0.8125rem] leading-snug text-ink">
          {note}
        </span>
      </span>
    </span>
  );
}

// A hazard notice, printed in magenta overprint the way every caution on a real
// chart is
export function Overprint({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overprint px-4 py-3", className)}>{children}</div>
  );
}

// The compass rose. Drawn once, used as the product's mark
export function CompassRose({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
      <circle
        cx="24"
        cy="24"
        r="14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* The four cardinal points: north filled, the rest hollow. */}
      <path d="M24 2.5 L27.6 21 L24 24 L20.4 21 Z" fill="currentColor" />
      <path
        d="M24 45.5 L20.4 27 L24 24 L27.6 27 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M45.5 24 L27 27.6 L24 24 L27 20.4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M2.5 24 L21 20.4 L24 24 L21 27.6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
    </svg>
  );
}

// How a panel gets mounted: a hairline border and a ruled title bar, never
// a rounded shadowed card
export function Plate({
  title,
  aside,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "relative border border-rule-strong bg-paper-raised/70 backdrop-blur-[2px]",
        className,
      )}
    >
      {title ? (
        <header className="flex items-baseline justify-between gap-4 border-b border-rule px-4 py-2.5">
          <Label as="div" className="text-ink">
            {title}
          </Label>
          {aside ? <div className="apparatus">{aside}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
