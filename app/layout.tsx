import { AskSelection } from "@/components/ask/ask-selection";
import { SiteCursor } from "@/components/cursor/cursor";
import { Nav } from "@/components/nav/nav";
import { TalkButton } from "@/components/talk/talk-button";
import { TalkPanel } from "@/components/talk/talk-panel";
import { TalkProvider } from "@/components/talk/talk-provider";
import { home } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { Caveat, IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "@/tokens/tokens.css";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Immanuel Mensah",
    template: "%s | Immanuel Mensah",
  },
  description: home.hero.lead,
  openGraph: {
    title: "Immanuel Mensah",
    description: home.hero.lead,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script adds `js` before hydration so reveal styles apply on first paint.
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <TalkProvider>
          <Nav />
          {children}
          <TalkButton />
          <SiteCursor />
          <TalkPanel />
          <AskSelection />
        </TalkProvider>
      </body>
    </html>
  );
}
