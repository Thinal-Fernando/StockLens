import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ChartShell from "@/components/chart/ChartShell";
import NightLight from "@/components/NightLight";
import { CompassRose } from "@/components/chart/Apparatus";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) redirect("/");

  return (
    // A different seed: the sign-in sheet shows a different stretch of water
    // from the one inside the product
    <ChartShell seed={19041215}>
      <main className="flex min-h-screen flex-col lg:flex-row">
        {/* The form. Printed on the sheet, not floating in a card. */}
        <section className="flex w-full flex-col border-rule-strong bg-paper/90 px-6 backdrop-blur-md md:px-12 lg:w-[46%] lg:border-r xl:px-16">
          <div className="flex items-center justify-between gap-4 py-6">
            <Link
              href="/"
              className="group flex items-center gap-3 focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
            >
              <CompassRose
                size={26}
                className="text-water transition-transform duration-500 ease-out group-hover:rotate-45"
              />
              <span className="chart-title text-[1.25rem] uppercase tracking-[0.18em]">
                StockLens
              </span>
            </Link>
            <NightLight />
          </div>

          <div className="flex flex-1 flex-col justify-center py-8">
            <div className="w-full max-w-[30rem]">{children}</div>
          </div>
        </section>

        {/* The plate: the sheet this account gets you, mounted and captioned. */}
        <section className="relative hidden w-full flex-col justify-center overflow-hidden px-12 py-16 lg:flex lg:w-[54%] xl:px-20">
          <figure className="relative z-10 max-w-2xl">
            <blockquote className="font-text text-[clamp(1.375rem,2.3vw,1.875rem)] italic leading-snug text-ink">
              StockLens turned my portfolio into a winning list. The alerts are
              spot on, and I feel more confident making moves in the market.
            </blockquote>
            <figcaption className="mt-6 flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="h-px w-10 translate-y-[-0.3em] bg-rule-strong"
              />
              <span className="apparatus text-ink">Ethan B.</span>
              <span className="apparatus text-ink-3">Retail investor</span>
            </figcaption>
          </figure>

          <figure className="relative z-10 mt-14 max-w-3xl">
            <div className="border border-rule-strong bg-paper-raised p-2 shadow-[0_28px_70px_-32px_rgba(0,0,0,0.55)]">
              {/* Provenance: a screenshot of this build's own dashboard,
                  captured at 1440x900 @2x. The previous asset showed the
                  pre-redesign dark UI and contradicted the page it sat on. */}
              <Image
                src="/assets/images/dashboard-soundings.png"
                alt="The StockLens dashboard: the volatility threshold control and its legend beside live market data panels"
                width={2880}
                height={1800}
                className="h-auto w-full border border-rule"
                priority
              />
            </div>
            <figcaption className="apparatus mt-3 flex items-baseline justify-between gap-4">
              <span>Panel I — the dashboard after signing in</span>
              <span className="text-ink-3">StockLens</span>
            </figcaption>
          </figure>
        </section>
      </main>
    </ChartShell>
  );
};

export default Layout;
