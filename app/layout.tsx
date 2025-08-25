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
    default: "BlackStrike",
  },
  description: "Advanced crypto trading bot platform. Automate your trading strategies with AI-powered bots.",
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
