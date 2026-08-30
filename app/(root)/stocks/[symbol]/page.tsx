import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { RuledHeading } from "@/components/chart/Apparatus";
import { isInWatchlist } from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

const scriptUrl =
  "https://s3.tradingview.com/external-embedding/embed-widget-";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const inWatchlist = await isInWatchlist(symbol);
  const ticker = symbol.toUpperCase();

  return (
    <div>
      {/* The symbol set at chart-title scale: this page's structural anchor,
          lettered the way a chart letters the water it names. */}
      <header className="mb-10 border-b border-rule-strong pb-8">
        <p className="apparatus mb-5">Instrument</p>
        <h1 className="chart-title text-[clamp(3.5rem,13vw,9rem)] tracking-[0.06em]">
          {ticker}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* The soundings themselves. */}
        <div className="flex min-w-0 flex-col gap-10">
          <section>
            <RuledHeading aside="Panel I">Today</RuledHeading>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
          </section>

          <section>
            <RuledHeading aside="Panel II">
              Price, day by day
            </RuledHeading>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              height={600}
            />
            <p className="mt-3 max-w-[62ch] font-text text-[0.875rem] italic leading-snug text-ink-2">
              Each mark is one day: where the price opened, how high and low it
              travelled, and where it closed.
            </p>
          </section>

          <section>
            <RuledHeading aside="Panel III">Against its own baseline</RuledHeading>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={BASELINE_WIDGET_CONFIG(symbol)}
              height={600}
            />
          </section>
        </div>

        {/* The margin: the apparatus a reader consults beside the survey. */}
        <aside className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-40 lg:self-start">
          <WatchlistButton
            symbol={ticker}
            company={ticker}
            isInWatchlist={inWatchlist}
          />

          <section>
            <RuledHeading>Signals</RuledHeading>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />
            <p className="mt-3 font-text text-[0.875rem] italic leading-snug text-ink-2">
              A summary of what common price indicators currently read. A
              starting point for a question, not an instruction.
            </p>
          </section>

          <section>
            <RuledHeading>The company</RuledHeading>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />
          </section>

          <section>
            <RuledHeading>Its accounts</RuledHeading>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
