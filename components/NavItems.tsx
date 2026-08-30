"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "./SearchCommand";
import { cn } from "@/lib/utils";

// Routes across the sheet. A chart's index is a keyed list, not a row of buttons
const NAV_ROUTES = [
  { href: "/", title: "Dashboard" },
  { href: "/cse", title: "Sri Lanka" },
  { href: "/watchlist", title: "Watchlist" },
] as const;

const NavItems = ({ compact = false }: { compact?: boolean }) => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <ul
      className={cn(
        "flex items-center",
        compact ? "gap-1 overflow-x-auto" : "gap-1",
      )}
    >
      {NAV_ROUTES.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 transition-colors duration-200",
                "focus:outline-none focus-visible:outline-1 focus-visible:outline-caution",
                active ? "text-ink" : "text-ink-2 hover:text-ink",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 border transition-colors",
                  active
                    ? "border-caution bg-caution"
                    : "border-rule-strong bg-transparent group-hover:border-ink-2",
                )}
              />
              <span className="apparatus whitespace-nowrap text-current">{item.title}</span>
            </Link>
          </li>
        );
      })}

      <li className="ml-1">
        <SearchCommand renderAs="text" label="Search" initialStocks={[]} />
      </li>
    </ul>
  );
};

export default NavItems;
