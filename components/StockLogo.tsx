"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StockLogo({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  // No mark on file: a survey station with nothing plotted in it
  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex size-6 shrink-0 items-center justify-center border border-rule-strong text-ink-3",
          className,
        )}
      >
        <TrendingUp className="size-3.5" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "size-6 shrink-0 border border-rule bg-paper object-contain p-0.5",
        className,
      )}
    />
  );
}
