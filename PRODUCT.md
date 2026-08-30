# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **first-year investors** — people in roughly their first twelve months
of owning stocks. They have a small real position and real money at stake, they
are not professionals, and they open StockLens to understand what is happening
as much as to track it. They arrive with vocabulary gaps (P/E, market cap, RSI
are words they have seen but could not confidently define) and a low tolerance
for being made to feel stupid.

Their situation: checking in between other things — a phone on a commute, a
laptop tab open beside work — not a trading desk. The job is "tell me what
changed with the companies I care about, and help me understand why it matters."

## Product Purpose

StockLens tracks real-time market data for the companies a person chooses to
follow, and surrounds that data with enough context that a beginner can act on
it. Success is a user who returns weekly, keeps a watchlist they actually
maintain, and understands more about their holdings after three months than they
did on day one.

## Positioning

Onboarding is not a tour — it is a personalization intake (investment goals,
risk tolerance, preferred industry, country) that feeds an automated Inngest
pipeline producing personalized email digests. The product's mechanism is that
the signup form's answers keep working for the user after signup, unattended.
Most retail dashboards ask nothing and personalize nothing.

## Operating Context

- Auth-gated: every market surface requires a session; unauthenticated users are
  redirected to `/sign-in`.
- Surfaces: dashboard (`/`), stock detail (`/stocks/[symbol]`), watchlist
  (`/watchlist`), sign-in, sign-up.
- Search is a global ⌘K / Ctrl-K command palette over Finnhub's symbol index,
  reachable from the header on every page and from the watchlist empty state.
- Market data is embedded, not owned: TradingView widget scripts render the
  market overview, heatmap, timeline, quotes, symbol info, advanced/candle and
  baseline charts, technical analysis, company profile, and financials.
- Watchlist state is per-user and persisted in MongoDB; add/remove is optimistic
  with a toast and server-action rollback.
- Background jobs (Inngest) send onboarding and news-summary email through
  Nodemailer, driven by the profile captured at signup.

## Capabilities and Constraints

**Confirmed functionality:** email/password auth (better-auth) with a demo
account button, personalized signup intake, symbol search, stock detail pages,
watchlist CRUD, price alerts surfaced on the watchlist route, automated email.

**Technical constraints:**

- Next.js 16 App Router, React 19, Tailwind v4 (CSS-first `@theme`), TypeScript.
- shadcn-style components built on `@base-ui/react`; `cmdk` for the palette;
  `sonner` for toasts; `lucide-react` for icons.
- TradingView widgets are third-party iframes. Their internal DOM is not ours to
  restyle; they accept a theme/color configuration object and are otherwise
  styled only at their container boundary. They are the data layer and stay.
- Server Components by default; interactivity is opt-in via `"use client"`.

**Undecided / not established:** pricing, any paid tier, real user counts,
press, or partner logos. None exist and none may be fabricated.

## Brand Commitments

Name: **StockLens**. Nothing else is binding — the user confirmed on
2026-08-30 that palette, typography, layout, and component language are all
open for replacement, and that the incumbent look (near-black grays with a
yellow accent) is evidence of what the product does, not authority over how it
should look.

## Evidence on Hand

- `public/assets/images/dashboard-f.png` — a screenshot of the product's own
  dashboard, currently used as the auth-page preview.
- Live market data via Finnhub and TradingView; real symbols, real prices.
- One testimonial string in the auth layout attributed to "Ethan B., Retail
  Investor." Provenance unverified — treat as placeholder, do not multiply it
  into a testimonial wall.
- No customer count, revenue figure, award, or press mention exists.

## Product Principles

1. **The beginner is the reader.** Any number shown should be explainable to
   someone in their first year. Jargon appears with its meaning within reach,
   never as an unexplained badge of seriousness.
2. **Data is borrowed; context is ours.** TradingView owns the chart. StockLens
   owns the framing, the sequence, and the reason a person should care.
3. **Onboarding answers must keep paying off.** What the signup form asks, the
   product must visibly use — in email, in defaults, in what surfaces first.
4. **Real money, real restraint.** No gamified streaks, confetti on a green day,
   or urgency devices. The user's stake is genuine and the interface should not
   trade on their anxiety.
5. **Invent nothing.** Prices, holdings, and proof are real or explicitly
   labeled as sample.

## Accessibility & Inclusion

Financial red/green is decorative-plus-semantic here, so direction must never be
carried by hue alone — pair it with sign, arrow, or position. Numeric data needs
tabular figures and a monospaced or lining-figure treatment so columns compare
cleanly. Target contrast: WCAG AA for all text, including the small metadata
rows the current design fails.
