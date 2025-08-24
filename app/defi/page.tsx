import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import EmailIcon from "@/components/icons/email"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import Image from "next/image"

const connectedWallets = [
  {
    id: 1,
    name: "MetaMask Wallet",
    address: "0x742d...4c2f",
    network: "Ethereum",
    logo: "/metamask-logo.png",
    status: "connected",
    totalValue: "$23,450.80",
    nativeBalance: "8.45 ETH",
    connectedDate: "2024-01-15",
    lastSync: "2 minutes ago",
  },
  {
    id: 2,
    name: "Phantom Wallet",
    address: "9WzD...Kx7m",
    network: "Solana",
    logo: "/phantom-logo.png",
    status: "connected",
    totalValue: "$12,680.25",
    nativeBalance: "156.8 SOL",
    connectedDate: "2024-02-01",
    lastSync: "5 minutes ago",
  },
  {
    id: 3,
    name: "WalletConnect",
    address: "0x8a3b...9d1e",
    network: "Polygon",
    logo: "/walletconnect-logo.png",
    status: "connected",
    totalValue: "$5,230.15",
    nativeBalance: "2,450 MATIC",
    connectedDate: "2024-03-10",
    lastSync: "1 hour ago",
  },
]

const defiPositions = [
  {
    id: 1,
    protocol: "Uniswap V3",
    type: "Liquidity Pool",
    pair: "ETH/USDC",
    logo: "/uniswap-logo.png",
    network: "Ethereum",
    value: "$8,450.30",
    apy: "12.4%",
    rewards: "+$124.50",
    status: "active",
    risk: "medium",
  },
  {
    id: 2,
    protocol: "Aave",
    type: "Lending",
    pair: "USDC Supply",
    logo: "/aave-logo.png",
    network: "Ethereum",
    value: "$15,200.00",
    apy: "4.2%",
    rewards: "+$89.30",
    status: "active",
    risk: "low",
  },
  {
    id: 3,
    protocol: "Compound",
    type: "Lending",
    pair: "ETH Supply",
    logo: "/compound-logo.png",
    network: "Ethereum",
    value: "$6,800.50",
    apy: "3.8%",
    rewards: "+$45.20",
    status: "active",
    risk: "low",
  },
  {
    id: 4,
    protocol: "Raydium",
    type: "Liquidity Pool",
    pair: "SOL/USDC",
    logo: "/raydium-logo.png",
    network: "Solana",
    value: "$4,230.80",
    apy: "18.6%",
    rewards: "+$78.90",
    status: "active",
    risk: "high",
  },
  {
    id: 5,
    protocol: "Curve",
    type: "Yield Farming",
    pair: "3Pool",
    logo: "/curve-logo.png",
    network: "Ethereum",
    value: "$12,500.00",
    apy: "6.8%",
    rewards: "+$156.40",
    status: "active",
    risk: "medium",
  },
]

const defiStats = [
  {
    label: "TOTAL VALUE",
    value: "$47,181.60",
    description: "ACROSS ALL POSITIONS",
    icon: EmailIcon,
  },
  {
    label: "YIELD EARNED",
    value: "+$494.30",
    description: "THIS MONTH",
    icon: GearIcon,
  },
  {
    label: "ACTIVE POSITIONS",
    value: "5",
    description: "DEFI PROTOCOLS",
    icon: ProcessorIcon,
  },
]

export default function DeFiPositionsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "DeFi Positions",
        description: "Manage your decentralized finance positions",
        icon: EmailIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {defiStats.map((stat, index) => (
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

      {/* Connected Wallets */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Connected Wallets</h2>
          <Button>
            <EmailIcon className="mr-2 size-4" />
            Add Wallet
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {connectedWallets.map((wallet) => (
            <Card key={wallet.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full overflow-hidden bg-background p-2">
                      <Image
                        src={wallet.logo || "/placeholder.svg"}
                        alt={wallet.name}
                        width={24}
                        height={24}
                        className="size-full object-contain"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-display">{wallet.name}</CardTitle>
                      <p className="text-xs text-muted-foreground font-mono">{wallet.address}</p>
                    </div>
                  </div>
                  <Switch checked={wallet.status === "connected"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Total Value</p>
                  <p className="font-mono text-lg">{wallet.totalValue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Native Balance</p>
                  <p className="font-mono text-sm">{wallet.nativeBalance}</p>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t">
                  <span className="text-muted-foreground">Network:</span>
                  <Badge variant="outline" className="text-xs">
                    {wallet.network}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* DeFi Positions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Active Positions</h2>
          <Button variant="outline">
            <ProcessorIcon className="mr-2 size-4" />
            Refresh All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {defiPositions.map((position) => (
            <Card key={position.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                      <Image
                        src={position.logo || "/placeholder.svg"}
                        alt={position.protocol}
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-display">{position.protocol}</CardTitle>
                      <p className="text-sm text-muted-foreground">{position.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {position.network}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Position Value and APY */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Position Value</p>
                    <p className="font-mono text-lg">{position.value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">APY</p>
                    <p className="font-mono text-lg text-success">{position.apy}</p>
                  </div>
                </div>

                {/* Position Details */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pair:</span>
                    <span className="font-mono">{position.pair}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rewards:</span>
                    <span className="font-mono text-success">{position.rewards}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <Badge
                      variant={
                        position.risk === "low" ? "default" : position.risk === "medium" ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {position.risk.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Manage
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Harvest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardPageLayout>
  )
}
