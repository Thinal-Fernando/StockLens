import TradingViewWidget from "@/components/TradingViewWidget";
import NoticeToInvestors from "@/components/NoticeToInvestors";
import { DepthRail } from "@/components/chart/DepthRail";
import { RuledHeading } from "@/components/chart/Apparatus";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";

const scriptUrl =
  "https://s3.tradingview.com/external-embedding/embed-widget-";

export default async function Home() {
  const watchlist = await getWatchlistWithData().catch(() => []);

  const updated = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-14 lg:flex-row lg:gap-12">
      {/* The rail and the legend: the chart's one control and its key. */}
      <aside className="w-full h-10 shrink-0 lg:sticky lg:top-40 lg:w-60 lg:self-start">
        <DepthRail />
        
      </aside>

      <div className="min-w-0 flex-1">
        {/* The sheet's own statement. Not a hero: a title block. */}
        <header className="mb-8">
          <p className="apparatus mb-4">Updated: {updated}</p>
          <h1 className="chart-title max-w-[16ch] text-[clamp(2.5rem,6.5vw,4.75rem)]">
            Today&rsquo;s moves, by volatility
          </h1>
          <p className="mt-5 max-w-[58ch] font-text text-[1.0625rem] leading-relaxed text-ink-2">
            Every company you follow is classified by how far its price has
            moved today, up or down. Set the volatility threshold on the left to
            define how large a move has to be before it needs your attention. Every figure on this page recalculates to match it.
          </p>
        </header>

        {watchlist.length > 0 ? (
          <div className="mb-10">
            <NoticeToInvestors watchlist={watchlist} />
          </div>
        ) : null}

        {/* The plates. Deliberately unequal: the heatmap carries the survey. */}
        <section className="mb-12">
          <RuledHeading aside="Panels I–II">The whole market</RuledHeading>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <TradingViewWidget
                title="Market overview"
                index="I"
                scriptUrl={`${scriptUrl}market-overview.js`}
                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                height={600}
              />
            </div>
            <div className="xl:col-span-2">
              <TradingViewWidget
                title="Heatmap, by sector"
                index="II"
                scriptUrl={`${scriptUrl}stock-heatmap.js`}
                config={HEATMAP_WIDGET_CONFIG}
                height={600}
              />
            </div>
          </div>
        </section>

        <section>
          <RuledHeading aside="Panels III–IV">
            What is being reported
          </RuledHeading>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <TradingViewWidget
              title="Latest stories"
              index="III"
              scriptUrl={`${scriptUrl}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={600}
            />
            <TradingViewWidget
              title="Quotes"
              index="IV"
              scriptUrl={`${scriptUrl}market-quotes.js`}
              config={MARKET_DATA_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
