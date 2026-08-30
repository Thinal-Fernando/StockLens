import Link from "next/link";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import NightLight from "./NightLight";
import SessionCode from "./SessionCode";
import { CompassRose } from "./chart/Apparatus";

// The title block: who published this, which market, and when it was last
// updated. Two ruled bands closed with a border
const Header = ({ user }: { user: User }) => {
  const corrected = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50">
      {/* The imprint band. */}
      <div className="border-b border-rule bg-paper-sunk/90 backdrop-blur-md">
        <div className="chart-block flex items-center justify-between gap-4 py-1.5">
          <p className="apparatus truncate">
            Equity Markets
            <span aria-hidden="true" className="mx-2 text-ink-2">
              /
            </span>
            <span className="text-ink-2">
              <SessionCode /> Session
            </span>
          </p>
          <div className="flex items-center gap-1 sm:gap-3">
            <p className="apparatus hidden text-ink-2 sm:block">
              Updated{" "}
              <span data-figure="" className="tabular-nums">
                {corrected}
              </span>
            </p>
            <NightLight />
          </div>
        </div>
      </div>

      {/* The sheet's own name, and the routes across it. */}
      <div className="border-b border-rule-strong bg-paper/85 backdrop-blur-md">
        <div className="chart-block flex h-17 items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
          >
            <CompassRose
              size={30}
              className="text-water transition-transform duration-500 ease-out group-hover:rotate-45"
            />
            <span className="chart-title text-[1.4rem] uppercase tracking-[0.18em] sm:text-[1.6rem]">
              StockLens
            </span>
          </Link>

          <nav className="hidden md:block" aria-label="Primary">
            <NavItems />
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <UserDropdown user={user} />
          </div>
        </div>
      </div>

      {/* Small screens carry the routes on their own ruled line. */}
      <div className="border-b border-rule bg-paper/85 backdrop-blur-md md:hidden">
        <nav className="chart-block py-1" aria-label="Primary, compact">
          <NavItems compact />
        </nav>
      </div>
    </header>
  );
};

export default Header;
