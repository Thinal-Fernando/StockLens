declare global {
  type SignInFormData = {
    email: string;
    password: string;
  };

  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
  };

  type CountrySelectProps = {
    name: string;
    label: string;
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };

  type Option = {
    value: string;
    label: string;
  };

  type SelectFieldProps = {
    name: string;
    label: string;
    placeholder: string;
    options: readonly Option[];
    control: Control;
    error?: FieldError;
    required?: boolean;
  };

  type FooterLinkProps = {
    text: string;
    linkText: string;
    href: string;
  };

  type SearchCommandProps = {
    renderAs?: "button" | "text";
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
  };

  type WelcomeEmailData = {
    email: string;
    name: string;
    intro: string;
  };

  type User = {
    id: string;
    name: string;
    email: string;
  };

  /** Which exchange a symbol belongs to. Drives routing, currency and data source. */
  type Market = "US" | "CSE";

  type Currency = "USD" | "LKR";

  type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    type: string;
    logo?: string;
    market: Market;
  };

  type StockWithWatchlistStatus = Stock & {
    isInWatchlist: boolean;
  };

  type FinnhubSearchResult = {
    symbol: string;
    description: string;
    displaySymbol?: string;
    type: string;
  };

  type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
  };

  type StockDetailsPageProps = {
    params: Promise<{
      symbol: string;
    }>;
  };

  type WatchlistButtonProps = {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    market?: Market;
    showTrashIcon?: boolean;
    type?: "button" | "icon";
    onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
  };

  type QuoteData = {
    c?: number;
    dp?: number;
  };

  type ProfileData = {
    name?: string;
    marketCapitalization?: number;
  };

  type FinancialsData = {
    metric?: { [key: string]: number };
  };

  type SelectedStock = {
    symbol: string;
    company: string;
    currentPrice?: number;
  };

  type WatchlistTableProps = {
    watchlist: StockWithData[];
  };

  type StockWithData = {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
    market: Market;
    currentPrice?: number;
    changePercent?: number;
    priceFormatted?: string;
    changeFormatted?: string;
    marketCap?: string;
    peRatio?: string;
  };

  type AlertsListProps = {
    alertData: Alert[] | undefined;
  };

  type MarketNewsArticle = {
    id: number;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    category: string;
    related: string;
    image?: string;
  };

  type WatchlistNewsProps = {
    news?: MarketNewsArticle[];
  };

  type SearchCommandProps = {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    renderAs?: "button" | "text";
    buttonLabel?: string;
    buttonVariant?: "primary" | "secondary";
    className?: string;
  };

  type AlertData = {
    symbol: string;
    company: string;
    alertName: string;
    alertType: "upper" | "lower";
    threshold: string;
  };

  type AlertModalProps = {
    alertId?: string;
    alertData?: AlertData;
    action?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
  };

  type RawNewsArticle = {
    id: number;
    headline?: string;
    summary?: string;
    source?: string;
    url?: string;
    datetime?: number;
    image?: string;
    category?: string;
    related?: string;
  };

  type Alert = {
    id: string;
    symbol: string;
    company: string;
    alertName: string;
    currentPrice: number;
    alertType: "upper" | "lower";
    threshold: number;
    changePercent?: number;
  };

  /* ------------------------------------------------------------------ *
   * Colombo Stock Exchange (cse.lk)                                     *
   *                                                                     *
   * Field names below mirror the API's own spelling, typos included     *
   * (`reqTradeSummery`, `sharevolume`, …). Timestamps are epoch ms and  *
   * every money value is LKR. Anything that can be absent on a security *
   * that has not traded today is typed nullable.                        *
   * ------------------------------------------------------------------ */

  type CseMarketStatus = {
    status: string;
  };

  /** Shared shape of the ASPI (`aspiData`) and S&P SL20 (`snpData`) feeds. */
  type CseIndexData = {
    id: number;
    value: number;
    lowValue: number;
    highValue: number;
    change: number;
    percentage: number;
    sectorId?: number;
    timestamp: number;
  };

  /** `tradeVolume` here is turnover in LKR, not a share count. CSE's naming. */
  type CseMarketSummary = {
    id: number;
    tradeVolume: number;
    shareVolume: number;
    tradeDate: number;
    trades: number;
  };

  type CseTradeSummaryItem = {
    id: number;
    name: string;
    symbol: string;
    logoUrl?: string | null;
    quantity?: number | null;
    percentageChange?: number | null;
    change?: number | null;
    price?: number | null;
    previousClose?: number | null;
    high?: number | null;
    low?: number | null;
    open?: number | null;
    closingPrice?: number | null;
    lastTradedTime?: number | null;
    issueDate?: string | null;
    turnover?: number | null;
    sharevolume?: number | null;
    tradevolume?: number | null;
    marketCap?: number | null;
    marketCapPercentage?: number | null;
    crossingVolume?: number | null;
    crossingTradeVol?: number | null;
    status?: number | null;
  };

  type CseTradeSummaryResponse = {
    reqTradeSummery: CseTradeSummaryItem[];
  };

  /** Rows from `topGainers` / `topLooses` (CSE spells it "Looses"). */
  type CseMover = {
    id: number;
    securityId: number;
    symbol: string;
    price: number;
    change: number;
    changePercentage: number;
    tradeDate: number;
  };

  type CseActiveTrade = {
    id: number;
    securityId: number;
    symbol: string;
    tradeVolume: number;
    shareVolume: number;
    turnover: number;
    percentageShareVolume: number;
  };

  type CseSector = {
    id: number;
    sectorId: number;
    symbol: string;
    indexCode?: string;
    indexCodeSp?: string;
    indexName: string;
    name: string;
    indexValue: number;
    change: number;
    percentage: number;
    sectorTradeToday?: number | null;
    sectorVolumeToday?: number | null;
    sectorTurnoverToday?: number | null;
    sectorPreviousClose?: number | null;
    transactionTime?: number | null;
  };

  type CseSymbolInfo = {
    id: number;
    symbol: string;
    name: string;
    isin?: string | null;
    issueDate?: string | null;
    quantityIssued?: number | null;
    parValue?: number | null;
    lastTradedPrice?: number | null;
    previousClose?: number | null;
    change?: number | null;
    changePercentage?: number | null;
    marketCap?: number | null;
    marketCapPercentage?: number | null;
    hiTrade?: number | null;
    lowTrade?: number | null;
    closingPrice?: number | null;
    wtdHiPrice?: number | null;
    wtdLowPrice?: number | null;
    mtdHiPrice?: number | null;
    mtdLowPrice?: number | null;
    ytdHiPrice?: number | null;
    ytdLowPrice?: number | null;
    p12HiPrice?: number | null;
    p12LowPrice?: number | null;
    allHiPrice?: number | null;
    allLowPrice?: number | null;
    tdyShareVolume?: number | null;
    mtdShareVolume?: number | null;
    ytdShareVolume?: number | null;
    tdyTurnover?: number | null;
    mtdTurnover?: number | null;
    ytdTurnover?: number | null;
    foreignHoldings?: number | null;
    foreignPercentage?: number | null;
  };

  type CseCompanyInfo = {
    reqSymbolInfo?: CseSymbolInfo | null;
    reqSymbolBetaInfo?: {
      triASIBetaValue?: number | null;
      betaValueSPSL?: number | null;
      triASIBetaPeriod?: string | null;
    } | null;
    reqLogo?: { path?: string | null } | null;
  };

  type CseDetailedTrade = {
    id: number;
    name: string;
    symbol: string;
    price?: number | null;
    qty?: number | null;
    trades?: number | null;
    change?: number | null;
    changePercentage?: number | null;
    logoUrl?: string | null;
  };

  type CseDetailedTradesResponse = {
    reqDetailTrades: CseDetailedTrade[];
  };

  /** One high/low band on the company page (today, week, month, year, …). */
  type CsePriceRange = {
    label: string;
    low?: number | null;
    high?: number | null;
  };

  type CseMarketTableProps = {
    securities: CseTradeSummaryItem[];
  };
}

export {};
