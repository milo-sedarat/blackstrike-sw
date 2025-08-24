"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import BracketsIcon from "@/components/icons/brackets"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import Image from "next/image"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const portfolioAssets = [
  {
    id: 1,
    symbol: "BTC",
    name: "Bitcoin",
    logo: "/bitcoin-concept.png",
    balance: "2.45",
    value: "$67,450.30",
    percentage: "42.5%",
    change24h: "+2.4%",
    changeValue: "+$1,580.20",
    allocation: 42.5,
    color: "#f7931a",
  },
  {
    id: 2,
    symbol: "ETH",
    name: "Ethereum",
    logo: "/ethereum-abstract.png",
    balance: "12.8",
    value: "$38,720.00",
    percentage: "24.4%",
    change24h: "+1.8%",
    changeValue: "+$685.40",
    allocation: 24.4,
    color: "#627eea",
  },
  {
    id: 3,
    symbol: "SOL",
    name: "Solana",
    logo: "/solana-blockchain.png",
    balance: "245.6",
    value: "$18,420.80",
    percentage: "11.6%",
    change24h: "+5.2%",
    changeValue: "+$912.30",
    allocation: 11.6,
    color: "#9945ff",
  },
  {
    id: 4,
    symbol: "AVAX",
    name: "Avalanche",
    logo: "/avalanche.png",
    balance: "156.3",
    value: "$12,504.00",
    percentage: "7.9%",
    change24h: "-1.2%",
    changeValue: "-$152.40",
    allocation: 7.9,
    color: "#e84142",
  },
  {
    id: 5,
    symbol: "ADA",
    name: "Cardano",
    logo: "/cardano-blockchain.png",
    balance: "8,450",
    value: "$8,450.00",
    percentage: "5.3%",
    change24h: "+0.8%",
    changeValue: "+$67.20",
    allocation: 5.3,
    color: "#0033ad",
  },
  {
    id: 6,
    symbol: "MATIC",
    name: "Polygon",
    logo: "/abstract-polygon.png",
    balance: "12,680",
    value: "$6,340.00",
    percentage: "4.0%",
    change24h: "+3.1%",
    changeValue: "+$190.80",
    allocation: 4.0,
    color: "#8247e5",
  },
  {
    id: 7,
    symbol: "USDC",
    name: "USD Coin",
    logo: "/usdc-logo.png",
    balance: "7,250",
    value: "$7,250.00",
    percentage: "4.6%",
    change24h: "0.0%",
    changeValue: "$0.00",
    allocation: 4.6,
    color: "#2775ca",
  },
]

const performanceData = [
  { period: "1D", value: 158736, change: "+2.4%" },
  { period: "1W", value: 155420, change: "+5.8%" },
  { period: "1M", value: 142380, change: "+12.3%" },
  { period: "3M", value: 128950, change: "+23.1%" },
  { period: "1Y", value: 89420, change: "+77.5%" },
]

const portfolioStats = [
  {
    label: "TOTAL VALUE",
    value: "$159,135.10",
    description: "PORTFOLIO BALANCE",
    icon: BracketsIcon,
  },
  {
    label: "24H CHANGE",
    value: "+$3,283.50",
    description: "+2.1% PERFORMANCE",
    icon: GearIcon,
  },
  {
    label: "ASSETS",
    value: "7",
    description: "DIFFERENT TOKENS",
    icon: ProcessorIcon,
  },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function PortfolioPage() {
  const totalValue = portfolioAssets.reduce(
    (sum, asset) => sum + Number.parseFloat(asset.value.replace(/[$,]/g, "")),
    0,
  )

  return (
    <DashboardPageLayout
      header={{
        title: "Portfolio",
        description: "Track your asset allocation and performance",
        icon: BracketsIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {portfolioStats.map((stat, index) => (
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

      {/* Portfolio Allocation Chart and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioAssets}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="allocation"
                  >
                    {portfolioAssets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.symbol]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="period" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                    labelStyle={{ color: "#000" }}
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Asset Breakdown</h2>
          <Button variant="outline">
            <ProcessorIcon className="mr-2 size-4" />
            Refresh Prices
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {portfolioAssets.map((asset, index) => (
                <div
                  key={asset.id}
                  className={`flex items-center justify-between p-6 ${
                    index !== portfolioAssets.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                      <Image
                        src={asset.logo || "/placeholder.svg"}
                        alt={asset.name}
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg">{asset.symbol}</h3>
                        <Badge variant="outline" className="text-xs">
                          {asset.percentage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{asset.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {asset.balance} {asset.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg">{asset.value}</p>
                    <p
                      className={`text-sm ${
                        asset.change24h.startsWith("+")
                          ? "text-success"
                          : asset.change24h.startsWith("-")
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {asset.change24h} ({asset.changeValue})
                    </p>
                    <div className="mt-2 w-32">
                      <Progress value={asset.allocation} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  )
}
