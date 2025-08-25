import type { Metadata } from "next"
import { Roboto_Mono, Inter } from "next/font/google"
import "./globals.css"
import { V0Provider } from "@/lib/v0-context"
import { LayoutWrapper } from "@/components/layout-wrapper"

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false

export const metadata: Metadata = {
  title: {
    template: "%s – BlackStrike",
    default: "BlackStrike - Advanced Crypto Trading Bot Platform",
  },
  description: "Advanced crypto trading bot platform. Automate your trading strategies with AI-powered bots.",
  keywords: ["crypto trading", "trading bots", "automated trading", "cryptocurrency", "trading platform"],
  authors: [{ name: "BlackStrike" }],
  creator: "BlackStrike",
  publisher: "BlackStrike",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.blackstrike.ai",
    title: "BlackStrike - Advanced Crypto Trading Bot Platform",
    description: "Advanced crypto trading bot platform. Automate your trading strategies with AI-powered bots.",
    siteName: "BlackStrike",
    images: [
      {
        url: "/assets/blackstrike-logo.png",
        width: 1200,
        height: 630,
        alt: "BlackStrike Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackStrike - Advanced Crypto Trading Bot Platform",
    description: "Advanced crypto trading bot platform. Automate your trading strategies with AI-powered bots.",
    images: ["/assets/blackstrike-logo.png"],
  },
  icons: {
    icon: [
      { url: "/assets/blackstrike-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/blackstrike-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/assets/blackstrike-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/fonts/Rebels-Fett.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <V0Provider isV0={isV0}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </V0Provider>
      </body>
    </html>
  )
}
