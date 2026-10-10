import { AskSelection } from "@/components/ask/ask-selection";
import { Nav } from "@/components/nav/nav";
import { TalkButton } from "@/components/talk/talk-button";
import { TalkPanel } from "@/components/talk/talk-panel";
import { TalkProvider } from "@/components/talk/talk-provider";
import { home } from "@/lib/content";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Immanuel Mensah",
    template: "%s | Immanuel Mensah",
  },
  description: home.hero.lead,
  openGraph: {
    title: "Immanuel Mensah",
    description: home.hero.lead,
    images: [{ url: home.hero.portrait.src, alt: home.hero.portrait.alt }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${hand.variable}`}
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
          <TalkPanel />
          <AskSelection />
        </TalkProvider>
      </body>
    </html>
  );
}
