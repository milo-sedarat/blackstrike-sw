"use client" // Added client directive for Recharts components

import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProcessorIcon from "@/components/icons/proccesor"
import GearIcon from "@/components/icons/gear"
import BoomIcon from "@/components/icons/boom"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart, // Using AreaChart instead of ComposedChart to avoid mixing issues
} from "recharts"

const profitLossData: any[] = [];

const tradingVolumeData: any[] = [];

const winRateData: any[] = [];

const botPerformanceData: any[] = [];

const analyticsStats = [
  {
    label: "TOTAL PROFIT",
    value: "$0",
    description: "ALL TIME EARNINGS",
    icon: GearIcon,
  },
  {
    label: "WIN RATE",
    value: "0%",
    description: "SUCCESSFUL TRADES",
    icon: BoomIcon,
  },
  {
    label: "TOTAL TRADES",
    value: "0",
    description: "EXECUTED ORDERS",
    icon: ProcessorIcon,
  },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={14}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Analytics",
        description: "Detailed performance insights and metrics",
        icon: ProcessorIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {analyticsStats.map((stat, index) => (
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

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="winrate">Win Rate</TabsTrigger>
          <TabsTrigger value="bots">Bot Analysis</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Profit & Loss Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profitLossData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={(value: any, name: any) => [`$${value}`, name === "net" ? "Net P&L" : name]}
                      labelStyle={{ color: "#000" }}
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="loss"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                    <Area type="monotone" dataKey="net" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volume Tab */}
        <TabsContent value="volume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Trading Volume & Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tradingVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        name === "volume" ? `$${value.toLocaleString()}` : value,
                        name === "volume" ? "Volume" : "Trades",
                      ]}
                      labelStyle={{ color: "#000" }}
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    />
                    <Bar dataKey="volume" fill="#4f46e5" />
                    <Bar dataKey="trades" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Win Rate Tab */}
        <TabsContent value="winrate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-display">Overall Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={winRateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {winRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`, "Percentage"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-display">Win Rate Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Winning Trades</span>
                    <span className="font-mono text-lg text-success">654</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Losing Trades</span>
                    <span className="font-mono text-lg text-destructive">307</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Win</span>
                    <span className="font-mono text-lg text-success">+$12.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Loss</span>
                    <span className="font-mono text-lg text-destructive">-$8.20</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Profit Factor</span>
                    <span className="font-mono text-lg">1.52</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bot Analysis Tab */}
        <TabsContent value="bots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">Bot Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {botPerformanceData.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ProcessorIcon className="size-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm">{bot.bot}</h3>
                        <p className="text-xs text-muted-foreground">{bot.trades} trades</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase">Profit</p>
                        <p className={`font-mono text-sm ${bot.profit >= 0 ? "text-success" : "text-destructive"}`}>
                          {bot.profit >= 0 ? "+" : ""}${bot.profit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase">Win Rate</p>
                        <p className="font-mono text-sm">{bot.winRate}%</p>
                      </div>
                      <Badge variant={bot.profit >= 0 ? "default" : "destructive"} className="text-xs">
                        {bot.profit >= 0 ? "PROFITABLE" : "LOSS"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <div className="flex justify-end">
        <Button variant="outline">
          <ProcessorIcon className="mr-2 size-4" />
          Export Analytics
        </Button>
      </div>
    </DashboardPageLayout>
  )
}
