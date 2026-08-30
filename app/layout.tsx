import type { Metadata } from "next";
import {
  Archivo,
  Azeret_Mono,
  Libre_Caslon_Display,
  Libre_Caslon_Text,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

// The engraved register: chart titles and place names
const caslonDisplay = Libre_Caslon_Display({
  variable: "--font-caslon-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// The hydrographic register: anything afloat or submerged is set in italic
const caslonText = Libre_Caslon_Text({
  variable: "--font-caslon-text",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// The apparatus register: legend caps, controls, wayfinding
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Soundings: every figure on the chart. Tabular, lining, measured
const azeret = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
  display: "swap",
});

// Design contract, emitted as a real HTML comment so it ships with the build
const DIRECTION_CONTRACT = `
  StockLens — Soundings. Market data drawn as an Admiralty chart: flat depth
  tints, hairline rules, engraved Caslon titles, no radius, no cards. The
  accent is reserved for caution alone. Refuses the near-black neon dashboard
  this replaced. See DESIGN.md. Seed 03e6b273.
`;

function DirectionContract() {
  return (
    <div
      hidden
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION_CONTRACT}-->` }}
    />
  );
}

export const metadata: Metadata = {
  title: "StockLens",
  description:
    "Track real-time stock prices, get personalized alerts and explore detailed company insight",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${caslonDisplay.variable} ${caslonText.variable} ${archivo.variable} ${azeret.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DirectionContract />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
