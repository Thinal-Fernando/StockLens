import Header from "@/components/Header";
import ChartShell from "@/components/chart/ChartShell";
import SessionCode from "@/components/SessionCode";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // checks if the request is coming from a logged in user (auth is the
  // better-auth instance; Better Auth exposes `api`, and getSession() is one
  // of its authentication operations).
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/sign-in");

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  return (
    <ChartShell>
      <div className="flex min-h-screen flex-col">
        <Header user={user} />
        <main className="chart-block flex-1 py-8 md:py-12">{children}</main>
        <Colophon />
      </div>
    </ChartShell>
  );
};

// The imprint at the foot of the sheet: who drew it and from what
function Colophon() {
  return (
    // Land at the foot of the sheet: the buff tint a chart reserves for
    // everything fixed and dry
    <footer className="mt-12 border-t border-rule-strong bg-land/45 backdrop-blur-md">
      <div className="chart-block flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="apparatus">
          StockLens
          <span aria-hidden="true" className="mx-2 text-ink-2">
            /
          </span>
          <span className="text-ink-2">
            Equity Markets, <SessionCode />
          </span>
        </p>
        <p className="font-text text-[0.8125rem] italic leading-snug text-ink-2">
          Data from Finnhub and TradingView. Prices may be delayed. Nothing
          here is advice.
        </p>
      </div>
    </footer>
  );
}

export default Layout;
