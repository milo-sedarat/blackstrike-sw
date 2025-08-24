import type React from "react"
import { Roboto_Mono, Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { V0Provider } from "@/lib/v0-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"
import Widget from "@/components/dashboard/widget"
import Notifications from "@/components/dashboard/notifications"
import { MobileChat } from "@/components/chat/mobile-chat"
import Chat from "@/components/chat"
import AIChatbot from "@/components/dashboard/ai-chatbot"

const mockData = mockDataJson as MockData

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
    generator: 'v0.app'
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
          <SidebarProvider>
            {/* Mobile Header - only visible on mobile */}
            <MobileHeader mockData={mockData} />

            {/* Desktop Layout */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gap lg:px-sides">
              <div className="hidden lg:block col-span-2 top-0 relative">
                <DashboardSidebar />
              </div>
              <div className="col-span-1 lg:col-span-7">{children}</div>
              <div className="col-span-3 hidden lg:block">
                <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-clip">
                  <Widget widgetData={mockData.widgetData} />
                  <AIChatbot />
                  <Notifications initialNotifications={mockData.notifications} />
                  <Chat />
                </div>
              </div>
            </div>

            {/* Mobile Chat - floating CTA with drawer */}
            <MobileChat />
          </SidebarProvider>
        </V0Provider>
      </body>
    </html>
  )
}
