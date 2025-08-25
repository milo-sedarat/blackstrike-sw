"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Play, Square, Trash2, Settings, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { type TradingBot } from "@/lib/trading-engine"

export default function TradingBots() {
  const { user } = useAuth()
  const [bots, setBots] = useState<TradingBot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState<string | null>(null)
  const [isStopping, setIsStopping] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadBots()
    }
  }, [user])

  const loadBots = async () => {
    if (!user) return
    
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/trading/bots', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const botsData = await response.json()
        setBots(botsData)
      }
    } catch (error) {
      console.error('Error loading bots:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartBot = async (botId: string) => {
    if (!user) return
    
    setIsStarting(botId)
    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/trading/bots/${botId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'start' })
      })
      
      if (response.ok) {
        await loadBots() // Reload bots to get updated status
      } else {
        const errorData = await response.json()
        alert(`Error starting bot: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error starting bot:', error)
      alert('Error starting bot')
    } finally {
      setIsStarting(null)
    }
  }

  const handleStopBot = async (botId: string) => {
    if (!user) return
    
    setIsStopping(botId)
    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/trading/bots/${botId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'stop' })
      })
      
      if (response.ok) {
        await loadBots() // Reload bots to get updated status
      } else {
        const errorData = await response.json()
        alert(`Error stopping bot: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error stopping bot:', error)
      alert('Error stopping bot')
    } finally {
      setIsStopping(null)
    }
  }

  const handleDeleteBot = async (botId: string) => {
    if (!user) return
    
    if (!confirm('Are you sure you want to delete this bot?')) return
    
    setIsDeleting(botId)
    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/trading/bots/${botId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        await loadBots() // Reload bots to get updated list
      } else {
        const errorData = await response.json()
        alert(`Error deleting bot: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error deleting bot:', error)
      alert('Error deleting bot')
    } finally {
      setIsDeleting(null)
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500'
      case 'stopped':
        return 'bg-gray-500'
      case 'error':
        return 'bg-red-500'
      case 'paused':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStrategyColor = (strategy: string) => {
    switch (strategy.toLowerCase()) {
      case 'dca':
        return 'bg-blue-500'
      case 'grid':
        return 'bg-purple-500'
      case 'arbitrage':
        return 'bg-orange-500'
      case 'market_making':
        return 'bg-green-500'
      case 'momentum':
        return 'bg-pink-500'
      case 'scalping':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10">
              <TrendingUp className="size-4 text-blue-400" />
            </div>
            <span>Trading Bots</span>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10">
              <TrendingUp className="size-4 text-blue-400" />
            </div>
            <span>Trading Bots</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {bots.length} Active
            </Badge>
            <Button size="sm" variant="outline">
              <Plus className="size-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {bots.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="size-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No trading bots yet</p>
            <p className="text-sm">Create your first bot to start automated trading</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bots.map((bot) => (
              <div key={bot.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{bot.name}</h4>
                      <div className={cn("w-2 h-2 rounded-full", getStatusColor(bot.status))} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {bot.strategy.toUpperCase()}
                      </Badge>
                      <span>•</span>
                      <span>{bot.exchange}</span>
                      <span>•</span>
                      <span>{bot.tradingPair}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline">
                      <Settings className="size-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteBot(bot.id)}
                      disabled={isDeleting === bot.id}
                    >
                      {isDeleting === bot.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Investment</div>
                    <div className="font-medium">{formatCurrency(bot.investment)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Value</div>
                    <div className="font-medium">{formatCurrency(bot.currentValue)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total P&L</div>
                    <div className={cn(
                      "font-medium",
                      bot.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(bot.totalPnL)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Win Rate</div>
                    <div className="font-medium">{bot.winRate.toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant={bot.status === 'running' ? 'destructive' : 'default'}
                      onClick={() => bot.status === 'running' ? handleStopBot(bot.id) : handleStartBot(bot.id)}
                      disabled={isStarting === bot.id || isStopping === bot.id}
                    >
                      {isStarting === bot.id || isStopping === bot.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                      ) : bot.status === 'running' ? (
                        <Square className="size-3" />
                      ) : (
                        <Play className="size-3" />
                      )}
                      {isStarting === bot.id ? 'Starting...' : 
                       isStopping === bot.id ? 'Stopping...' :
                       bot.status === 'running' ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {bot.lastTradeAt ? (
                      `Last trade: ${new Date(bot.lastTradeAt).toLocaleTimeString()}`
                    ) : (
                      'No trades yet'
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
