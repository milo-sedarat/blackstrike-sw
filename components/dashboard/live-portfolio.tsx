"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { marketDataService, type PortfolioData } from "@/lib/market-data"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock user holdings - in real app this would come from user's connected exchanges
const mockHoldings = [
  { symbol: 'BTC', amount: 0.5 },
  { symbol: 'ETH', amount: 3.2 },
  { symbol: 'SOL', amount: 25.0 },
  { symbol: 'ADA', amount: 1000 },
  { symbol: 'AVAX', amount: 15.0 },
  { symbol: 'MATIC', amount: 500 }
]

export default function LivePortfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const data = await marketDataService.getPortfolioData(mockHoldings)
        setPortfolioData(data)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPortfolioData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Live Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!portfolioData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Live Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Failed to load portfolio data
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5" />
            Live Portfolio
          </div>
          <Badge variant="outline" className="text-xs">
            {lastUpdated.toLocaleTimeString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioData.totalValue)}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className={cn(
              "text-2xl font-bold flex items-center justify-center gap-1",
              portfolioData.totalChangePercent24h >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {portfolioData.totalChangePercent24h >= 0 ? (
                <TrendingUp className="size-5" />
              ) : (
                <TrendingDown className="size-5" />
              )}
              {formatPercentage(portfolioData.totalChangePercent24h)}
            </div>
            <div className="text-sm text-muted-foreground">24h Change</div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Assets</h4>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-2">
            {portfolioData.assets.slice(0, 5).map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold">{asset.symbol}</span>
                  </div>
                  <div>
                    <div className="font-medium">{asset.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {asset.amount.toFixed(4)} {asset.symbol}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(asset.value)}
                  </div>
                  <div className={cn(
                    "text-xs",
                    asset.changePercent24h >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatPercentage(asset.changePercent24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="space-y-3">
          <h4 className="font-medium">Allocation</h4>
          <div className="space-y-2">
            {portfolioData.assets.map((asset) => {
              const percentage = (asset.value / portfolioData.totalValue) * 100
              return (
                <div key={asset.symbol} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{asset.symbol}</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 