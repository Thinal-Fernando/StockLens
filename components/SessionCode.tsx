"use client";

import { usePathname } from "next/navigation";

// The CSE routes are a separate exchange, so the title block and colophon
// name the market you are actually reading rather than defaulting to US
export function useSessionCode(): "US" | "SL" {
  const pathname = usePathname();
  return pathname === "/cse" || pathname.startsWith("/cse/") ? "SL" : "US";
}

export default function SessionCode() {
  return <>{useSessionCode()}</>;
}
