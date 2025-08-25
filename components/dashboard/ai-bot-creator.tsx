"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import CuteRobotIcon from "@/components/icons/cute-robot"
import { Send, Zap, Bot, TrendingUp, DollarSign } from "lucide-react"

interface BotConfig {
  name: string
  strategy: 'dca' | 'grid' | 'arbitrage' | 'market_making'
  exchange: string
  tradingPair: string
  investment: number
  frequency?: string
  gridLevels?: number
  stopLoss?: number
  takeProfit?: number
}

interface AISuggestion {
  id: string
  title: string
  description: string
  config: Partial<BotConfig>
  confidence: number
}

export default function AIBotCreator() {
  const [userInput, setUserInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [selectedConfig, setSelectedConfig] = useState<BotConfig | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateBot = async () => {
    if (!userInput.trim()) return

    setIsProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const newSuggestions = generateAISuggestions(userInput)
      setSuggestions(newSuggestions)
      setIsProcessing(false)
    }, 2000)
  }

  const generateAISuggestions = (input: string): AISuggestion[] => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('dca') || lowerInput.includes('dollar cost average')) {
      return [
        {
          id: '1',
          title: 'ETH DCA Bot',
          description: 'Automated dollar-cost averaging for Ethereum with weekly $500 investments',
          config: {
            name: 'ETH DCA Bot',
            strategy: 'dca',
            exchange: 'binance',
            tradingPair: 'ETH/USDT',
            investment: 500,
            frequency: 'weekly'
          },
          confidence: 0.95
        }
      ]
    }
    
    if (lowerInput.includes('grid') || lowerInput.includes('grid trading')) {
      return [
        {
          id: '2',
          title: 'BTC Grid Bot',
          description: 'Grid trading bot for Bitcoin with 10 levels between $40K-$50K',
          config: {
            name: 'BTC Grid Bot',
            strategy: 'grid',
            exchange: 'binance',
            tradingPair: 'BTC/USDT',
            investment: 1000,
            gridLevels: 10
          },
          confidence: 0.92
        }
      ]
    }
    
    if (lowerInput.includes('arbitrage') || lowerInput.includes('arb')) {
      return [
        {
          id: '3',
          title: 'Cross-Exchange Arbitrage',
          description: 'Arbitrage bot between Binance and Coinbase for BTC/USDT',
          config: {
            name: 'BTC Arbitrage Bot',
            strategy: 'arbitrage',
            exchange: 'binance,coinbase',
            tradingPair: 'BTC/USDT',
            investment: 2000
          },
          confidence: 0.88
        }
      ]
    }
    
    // Default suggestion
    return [
      {
        id: '4',
        title: 'Smart Trading Bot',
        description: 'AI-optimized trading bot based on your requirements',
        config: {
          name: 'Smart Bot',
          strategy: 'dca',
          exchange: 'binance',
          tradingPair: 'BTC/USDT',
          investment: 1000
        },
        confidence: 0.75
      }
    ]
  }

  const handleSelectSuggestion = (suggestion: AISuggestion) => {
    setSelectedConfig(suggestion.config as BotConfig)
  }

  const handleCreateRealBot = async () => {
    if (!selectedConfig) return
    
    setIsCreating(true)
    
    try {
      // Call the real API to create the bot
      const response = await fetch('/api/hummingbot/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedConfig),
      })
      
      if (response.ok) {
        const newBot = await response.json()
        console.log('Bot created successfully:', newBot)
        // Reset form
        setUserInput("")
        setSuggestions([])
        setSelectedConfig(null)
      } else {
        throw new Error('Failed to create bot')
      }
    } catch (error) {
      console.error('Error creating bot:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-500/10">
            <CuteRobotIcon className="size-4 text-blue-400" />
          </div>
          <span>AI Bot Creator</span>
          <Badge variant="secondary" className="text-xs">
            <Zap className="size-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Natural Language Input */}
        <div className="space-y-2">
          <Label htmlFor="bot-request">Describe your bot</Label>
          <div className="flex gap-2">
            <Textarea
              id="bot-request"
              placeholder="e.g., Create an ETH DCA bot with $500 weekly buys"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1"
              rows={2}
            />
            <Button 
              onClick={handleCreateBot}
              disabled={isProcessing || !userInput.trim()}
              className="px-4"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <Label>AI Suggestions</Label>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedConfig?.name === suggestion.config.name
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-blue-300"
                    )}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {suggestion.description}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Bot Configuration */}
        {selectedConfig && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="size-4" />
              <span className="font-medium">Bot Configuration</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs">Strategy</Label>
                <div className="font-mono">{selectedConfig.strategy.toUpperCase()}</div>
              </div>
              <div>
                <Label className="text-xs">Exchange</Label>
                <div className="font-mono">{selectedConfig.exchange}</div>
              </div>
              <div>
                <Label className="text-xs">Trading Pair</Label>
                <div className="font-mono">{selectedConfig.tradingPair}</div>
              </div>
              <div>
                <Label className="text-xs">Investment</Label>
                <div className="font-mono">${selectedConfig.investment}</div>
              </div>
            </div>

            <Button 
              onClick={handleCreateRealBot}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating Bot...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  Create Bot
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Quick Templates */}
        <div className="space-y-2">
          <Label className="text-xs">Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserInput("Create an ETH DCA bot with $500 weekly buys")}
            >
              ETH DCA
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserInput("Create a BTC grid bot with 10 levels")}
            >
              BTC Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserInput("Create an arbitrage bot between Binance and Coinbase")}
            >
              Arbitrage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 