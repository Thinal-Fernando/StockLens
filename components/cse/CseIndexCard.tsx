import { cn, formatChangePercent } from "@/lib/utils";

type CseIndexCardProps = {
  title: string;
  subtitle: string;
  data: CseIndexData | null;
};

/**
 * One index tile (ASPI / S&P SL20). Index values are points, not currency, so
 * they are deliberately not run through `formatPrice`.
 */
export default function CseIndexCard({
  title,
  subtitle,
  data,
}: CseIndexCardProps) {
  if (!data) {
    return (
      <div className="cse-card">
        <h3 className="cse-card-title">{title}</h3>
        <p className="cse-card-value">—</p>
        <p className="cse-card-meta">Index data unavailable</p>
      </div>
    );
  }

  const isUp = data.change >= 0;

  return (
    <div className="cse-card">
      <h3 className="cse-card-title">{title}</h3>
      <p className="cse-card-value">
        {data.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p
        className={cn(
          "cse-card-change",
          isUp ? "text-green-500" : "text-red-500",
        )}
      >
        {isUp ? "+" : ""}
        {data.change.toFixed(2)} ({formatChangePercent(data.percentage)})
      </p>
      <p className="cse-card-meta">
        {subtitle} · Day range {data.lowValue.toFixed(2)} –{" "}
        {data.highValue.toFixed(2)}
      </p>
    </div>
  );
}
