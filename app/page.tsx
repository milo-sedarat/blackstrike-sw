import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import TradingBots from "@/components/dashboard/trading-bots"
import MarketAlerts from "@/components/dashboard/market-alerts"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import LightningIcon from "@/components/icons/lightning"

const cryptoStats = [
  {
    label: "PORTFOLIO VALUE",
    value: "$127,450",
    description: "TOTAL BALANCE",
    intent: "positive" as const,
    icon: "gear",
    direction: "up" as const,
  },
  {
    label: "DAILY P&L",
    value: "+$2,847",
    description: "24H PERFORMANCE",
    intent: "positive" as const,
    icon: "proccesor",
    direction: "up" as const,
  },
  {
    label: "ACTIVE BOTS",
    value: "7",
    description: "TRADING STRATEGIES",
    intent: "neutral" as const,
    icon: "boom",
    tag: "Running 🤖",
  },
]

const cryptoChartData = {
  week: [
    { date: "06/07", portfolio: 120000, pnl: 2500, volume: 15000 },
    { date: "07/07", portfolio: 125000, pnl: 3200, volume: 22000 },
    { date: "08/07", portfolio: 123000, pnl: -1800, volume: 18000 },
    { date: "09/07", portfolio: 128000, pnl: 4200, volume: 28000 },
    { date: "10/07", portfolio: 125500, pnl: -1200, volume: 16000 },
    { date: "11/07", portfolio: 127450, pnl: 2847, volume: 24000 },
    { date: "12/07", portfolio: 130000, pnl: 3500, volume: 32000 },
  ],
}

const tradingBots = [
  {
    id: 1,
    name: "BTC Grid Bot",
    strategy: "Grid Trading",
    pnl: "+$1,247",
    status: "active",
    avatar: "/bitcoin-concept.png",
    performance: "+12.4%",
  },
  {
    id: 2,
    name: "ETH DCA Bot",
    strategy: "Dollar Cost Average",
    pnl: "+$892",
    status: "active",
    avatar: "/ethereum-abstract.png",
    performance: "+8.9%",
  },
  {
    id: 3,
    name: "SOL Momentum",
    strategy: "Momentum Trading",
    pnl: "+$634",
    status: "active",
    avatar: "/solana-blockchain.png",
    performance: "+15.2%",
  },
  {
    id: 4,
    name: "AVAX Arbitrage",
    strategy: "Cross-Exchange",
    pnl: "+$423",
    status: "paused",
    avatar: "/avalanche.png",
    performance: "+6.7%",
  },
]

const marketAlerts = [
  {
    title: "BTC BREAKOUT",
    value: "$67,450",
    status: "[BULLISH]",
    variant: "success" as const,
  },
  {
    title: "ETH RESISTANCE",
    value: "$3,850",
    status: "[TESTING]",
    variant: "warning" as const,
  },
  {
    title: "PORTFOLIO ATH",
    value: "$130,000",
    status: "[ACHIEVED]",
    variant: "success" as const,
  },
]

// Icon mapping
const iconMap = {
  gear: GearIcon,
  proccesor: ProcessorIcon,
  boom: BoomIcon,
}

export default function DashboardOverview() {
  return (
    <DashboardPageLayout
      header={{
        title: "Dashboard",
        description: "Last updated 12:05",
        icon: LightningIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {cryptoStats.map((stat, index) => (
          <DashboardStat
            key={index}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={iconMap[stat.icon as keyof typeof iconMap]}
            tag={stat.tag}
            intent={stat.intent}
            direction={stat.direction}
          />
        ))}
      </div>

      <div className="mb-6">
        <DashboardChart />
      </div>

      {/* Main 2-column grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TradingBots bots={tradingBots} />
        <MarketAlerts alerts={marketAlerts} />
      </div>
    </DashboardPageLayout>
  )
}
