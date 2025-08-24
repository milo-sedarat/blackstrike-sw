import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import CuteRobotIcon from "@/components/icons/cute-robot"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import Image from "next/image"

const tradingBots = [
  {
    id: 1,
    name: "BTC Grid Bot",
    strategy: "Grid Trading",
    status: "active",
    pnl: "+$1,247.50",
    pnlPercent: "+12.4%",
    totalTrades: 247,
    winRate: "68%",
    avatar: "/bitcoin-concept.png",
    pair: "BTC/USDT",
    exchange: "Binance",
    created: "2024-01-15",
    investment: "$10,000",
  },
  {
    id: 2,
    name: "ETH DCA Bot",
    strategy: "Dollar Cost Average",
    status: "active",
    pnl: "+$892.30",
    pnlPercent: "+8.9%",
    totalTrades: 156,
    winRate: "72%",
    avatar: "/ethereum-abstract.png",
    pair: "ETH/USDT",
    exchange: "Coinbase",
    created: "2024-02-01",
    investment: "$10,000",
  },
  {
    id: 3,
    name: "SOL Momentum",
    strategy: "Momentum Trading",
    status: "active",
    pnl: "+$634.80",
    pnlPercent: "+15.2%",
    totalTrades: 89,
    winRate: "75%",
    avatar: "/solana-blockchain.png",
    pair: "SOL/USDT",
    exchange: "Binance",
    created: "2024-03-10",
    investment: "$4,200",
  },
  {
    id: 4,
    name: "AVAX Arbitrage",
    strategy: "Cross-Exchange",
    status: "paused",
    pnl: "+$423.15",
    pnlPercent: "+6.7%",
    totalTrades: 34,
    winRate: "82%",
    avatar: "/avalanche.png",
    pair: "AVAX/USDT",
    exchange: "Multiple",
    created: "2024-03-20",
    investment: "$6,300",
  },
  {
    id: 5,
    name: "ADA Swing Bot",
    strategy: "Swing Trading",
    status: "stopped",
    pnl: "-$156.20",
    pnlPercent: "-3.1%",
    totalTrades: 23,
    winRate: "43%",
    avatar: "/cardano-blockchain.png",
    pair: "ADA/USDT",
    exchange: "Kraken",
    created: "2024-04-01",
    investment: "$5,000",
  },
  {
    id: 6,
    name: "MATIC Scalper",
    strategy: "Scalping",
    status: "active",
    pnl: "+$289.45",
    pnlPercent: "+9.6%",
    totalTrades: 412,
    winRate: "64%",
    avatar: "/abstract-polygon.png",
    pair: "MATIC/USDT",
    exchange: "Binance",
    created: "2024-04-15",
    investment: "$3,000",
  },
]

const botStats = [
  {
    label: "TOTAL BOTS",
    value: "6",
    description: "CREATED STRATEGIES",
    icon: CuteRobotIcon,
  },
  {
    label: "ACTIVE BOTS",
    value: "4",
    description: "CURRENTLY RUNNING",
    icon: ProcessorIcon,
  },
  {
    label: "TOTAL PROFIT",
    value: "+$3,330.98",
    description: "ALL TIME EARNINGS",
    icon: GearIcon,
  },
]

export default function MyBotsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "My Bots",
        description: "Manage your trading strategies",
        icon: CuteRobotIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {botStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase">{stat.description}</p>
                </div>
                <stat.icon className="size-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Bot Button */}
      <div className="mb-6">
        <Button size="lg" className="font-display">
          <CuteRobotIcon className="mr-2 size-4" />
          Create New Bot
        </Button>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tradingBots.map((bot) => (
          <Card key={bot.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden bg-primary/10">
                    <Image
                      src={bot.avatar || "/placeholder.svg"}
                      alt={bot.name}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">{bot.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                  </div>
                </div>
                <Switch checked={bot.status === "active"} disabled={bot.status === "stopped"} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">P&L</p>
                  <p className={`font-mono text-lg ${bot.pnl.startsWith("+") ? "text-success" : "text-destructive"}`}>
                    {bot.pnl}
                  </p>
                  <p className={`text-sm ${bot.pnlPercent.startsWith("+") ? "text-success" : "text-destructive"}`}>
                    {bot.pnlPercent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Win Rate</p>
                  <p className="font-mono text-lg">{bot.winRate}</p>
                  <p className="text-sm text-muted-foreground">{bot.totalTrades} trades</p>
                </div>
              </div>

              {/* Bot Details */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pair:</span>
                  <span className="font-mono">{bot.pair}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange:</span>
                  <span>{bot.exchange}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Investment:</span>
                  <span className="font-mono">{bot.investment}</span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2">
                <Badge
                  variant={bot.status === "active" ? "default" : bot.status === "paused" ? "secondary" : "destructive"}
                >
                  {bot.status.toUpperCase()}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <GearIcon className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardPageLayout>
  )
}
