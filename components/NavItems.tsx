"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import SearchCommand from "./SearchCommand";
import { NAV_ITEMS } from "@/lib/constants";

const NavItems = () => {
  const pathname: string = usePathname();

  const isActive = (path: string) => {
    if (path == "/") return pathname == "/";

    return pathname.startsWith(path);
  };

  return (
    <ul className="nav-list">
      {NAV_ITEMS.map((item) => {
        if (item.label === "Search")
          return (
            <li key="search-trigger">
              <SearchCommand
                renderAs="text"
                label="Search"
                initialStocks={[]}
              />
            </li>
          );

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-yellow-500 transition-colors ${isActive(item.href) ? "text-gray-100" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
