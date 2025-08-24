import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import ProcessorIcon from "@/components/icons/proccesor"
import GearIcon from "@/components/icons/gear"
import Image from "next/image"

const connectedExchanges = [
  {
    id: 1,
    name: "Binance",
    logo: "/binance-logo.png",
    status: "connected",
    apiStatus: "active",
    totalBalance: "$45,230.50",
    availableBalance: "$12,450.30",
    tradingPairs: 247,
    connectedDate: "2024-01-15",
    permissions: ["spot", "futures", "margin"],
    lastSync: "2 minutes ago",
  },
  {
    id: 2,
    name: "Coinbase Pro",
    logo: "/coinbase-logo.png",
    status: "connected",
    apiStatus: "active",
    totalBalance: "$28,750.80",
    availableBalance: "$8,920.15",
    tradingPairs: 156,
    connectedDate: "2024-02-01",
    permissions: ["spot"],
    lastSync: "5 minutes ago",
  },
  {
    id: 3,
    name: "Kraken",
    logo: "/kraken-logo.png",
    status: "connected",
    apiStatus: "limited",
    totalBalance: "$15,680.25",
    availableBalance: "$3,240.80",
    tradingPairs: 89,
    connectedDate: "2024-03-10",
    permissions: ["spot", "margin"],
    lastSync: "1 hour ago",
  },
  {
    id: 4,
    name: "KuCoin",
    logo: "/kucoin-logo.png",
    status: "error",
    apiStatus: "inactive",
    totalBalance: "$0.00",
    availableBalance: "$0.00",
    tradingPairs: 0,
    connectedDate: "2024-04-01",
    permissions: [],
    lastSync: "Failed",
  },
]

const availableExchanges = [
  {
    name: "Bybit",
    logo: "/bybit-logo.png",
    description: "High-performance derivatives trading",
    features: ["Futures", "Options", "Spot"],
  },
  {
    name: "OKX",
    logo: "/okx-logo.png",
    description: "Global crypto exchange and Web3 ecosystem",
    features: ["Spot", "Futures", "DeFi"],
  },
  {
    name: "Huobi",
    logo: "/huobi-logo.png",
    description: "Leading digital asset exchange",
    features: ["Spot", "Futures", "Margin"],
  },
]

const exchangeStats = [
  {
    label: "CONNECTED",
    value: "3",
    description: "ACTIVE EXCHANGES",
    icon: ProcessorIcon,
  },
  {
    label: "TOTAL BALANCE",
    value: "$89,661.55",
    description: "ACROSS ALL EXCHANGES",
    icon: GearIcon,
  },
  {
    label: "TRADING PAIRS",
    value: "492",
    description: "AVAILABLE MARKETS",
    icon: ProcessorIcon,
  },
]

export default function ExchangesPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Exchanges",
        description: "Manage your exchange connections",
        icon: ProcessorIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {exchangeStats.map((stat, index) => (
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

      {/* Connected Exchanges */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Connected Exchanges</h2>
          <Button variant="outline">
            <ProcessorIcon className="mr-2 size-4" />
            Sync All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {connectedExchanges.map((exchange) => (
            <Card key={exchange.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                      <Image
                        src={exchange.logo || "/placeholder.svg"}
                        alt={exchange.name}
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-display">{exchange.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Connected {exchange.connectedDate}</p>
                    </div>
                  </div>
                  <Switch checked={exchange.status === "connected"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Balance Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Total Balance</p>
                    <p className="font-mono text-lg">{exchange.totalBalance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Available</p>
                    <p className="font-mono text-lg">{exchange.availableBalance}</p>
                  </div>
                </div>

                {/* Exchange Details */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trading Pairs:</span>
                    <span className="font-mono">{exchange.tradingPairs}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync:</span>
                    <span>{exchange.lastSync}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Permissions:</span>
                    <div className="flex gap-1">
                      {exchange.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Badge
                    variant={
                      exchange.apiStatus === "active"
                        ? "default"
                        : exchange.apiStatus === "limited"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {exchange.apiStatus.toUpperCase()}
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
      </div>

      {/* Available Exchanges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Available Exchanges</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableExchanges.map((exchange, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                    <Image
                      src={exchange.logo || "/placeholder.svg"}
                      alt={exchange.name}
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg">{exchange.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{exchange.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exchange.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full">Connect Exchange</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardPageLayout>
  )
}
