import { marketDataService } from './market-data'

export interface TradingBot {
  id: string
  name: string
  strategy: 'dca' | 'grid' | 'arbitrage' | 'market_making' | 'momentum' | 'scalping'
  status: 'running' | 'stopped' | 'paused' | 'error'
  exchange: string
  tradingPair: string
  investment: number
  currentValue: number
  totalPnL: number
  totalTrades: number
  winRate: number
  createdAt: Date
  lastTradeAt?: Date
  config: BotConfig
  performance: BotPerformance
}

export interface BotConfig {
  frequency?: string // for DCA
  gridLevels?: number // for Grid
  stopLoss?: number
  takeProfit?: number
  maxInvestment?: number
  riskLevel?: 'low' | 'medium' | 'high'
  autoRebalance?: boolean
  notifications?: boolean
}

export interface BotPerformance {
  totalPnL: number
  totalVolume: number
  winRate: number
  trades: Trade[]
  dailyReturns: DailyReturn[]
}

export interface Trade {
  id: string
  botId: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: Date
  pnl?: number
}

export interface DailyReturn {
  date: string
  return: number
  volume: number
}

export interface ExchangeConnection {
  id: string
  name: string
  type: 'cex' | 'dex'
  status: 'connected' | 'disconnected' | 'error'
  balance: number
  lastSync: Date
  apiKey?: string // encrypted
  apiSecret?: string // encrypted
  passphrase?: string // encrypted
}

class TradingEngine {
  private bots: Map<string, TradingBot> = new Map()
  private connections: Map<string, ExchangeConnection> = new Map()
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    // Load existing bots from storage
    await this.loadBots()
    
    // Initialize exchange connections
    await this.initializeConnections()
    
    // Start monitoring
    this.startMonitoring()
    
    this.isInitialized = true
  }

  async createBot(config: {
    name: string
    strategy: TradingBot['strategy']
    exchange: string
    tradingPair: string
    investment: number
    config: BotConfig
  }): Promise<TradingBot> {
    const bot: TradingBot = {
      id: this.generateId(),
      name: config.name,
      strategy: config.strategy,
      status: 'stopped',
      exchange: config.exchange,
      tradingPair: config.tradingPair,
      investment: config.investment,
      currentValue: config.investment,
      totalPnL: 0,
      totalTrades: 0,
      winRate: 0,
      createdAt: new Date(),
      config: config.config,
      performance: {
        totalPnL: 0,
        totalVolume: 0,
        winRate: 0,
        trades: [],
        dailyReturns: []
      }
    }

    this.bots.set(bot.id, bot)
    await this.saveBots()
    
    return bot
  }

  async startBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId)
    if (!bot) throw new Error('Bot not found')

    // Check if exchange is connected
    const connection = this.connections.get(bot.exchange)
    if (!connection || connection.status !== 'connected') {
      throw new Error(`Exchange ${bot.exchange} is not connected`)
    }

    // Start the bot based on strategy
    await this.executeStrategy(bot)
    
    bot.status = 'running'
    await this.saveBots()
  }

  async stopBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId)
    if (!bot) throw new Error('Bot not found')

    bot.status = 'stopped'
    await this.saveBots()
  }

  async deleteBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId)
    if (!bot) throw new Error('Bot not found')

    if (bot.status === 'running') {
      await this.stopBot(botId)
    }

    this.bots.delete(botId)
    await this.saveBots()
  }

  async getBots(): Promise<TradingBot[]> {
    return Array.from(this.bots.values())
  }

  async getBot(botId: string): Promise<TradingBot | null> {
    return this.bots.get(botId) || null
  }

  async connectExchange(config: {
    name: string
    type: 'cex' | 'dex'
    apiKey?: string
    apiSecret?: string
  }): Promise<ExchangeConnection> {
    const connection: ExchangeConnection = {
      id: this.generateId(),
      name: config.name,
      type: config.type,
      status: 'connected',
      balance: 0,
      lastSync: new Date(),
      apiKey: config.apiKey,
      apiSecret: config.apiSecret
    }

    // Test connection
    await this.testConnection(connection)
    
    this.connections.set(connection.id, connection)
    await this.saveConnections()
    
    return connection
  }

  async disconnectExchange(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId)
    if (!connection) throw new Error('Connection not found')

    connection.status = 'disconnected'
    await this.saveConnections()
  }

  async getConnections(): Promise<ExchangeConnection[]> {
    return Array.from(this.connections.values())
  }

  private async executeStrategy(bot: TradingBot): Promise<void> {
    switch (bot.strategy) {
      case 'dca':
        await this.executeDCA(bot)
        break
      case 'grid':
        await this.executeGrid(bot)
        break
      case 'arbitrage':
        await this.executeArbitrage(bot)
        break
      case 'market_making':
        await this.executeMarketMaking(bot)
        break
      case 'momentum':
        await this.executeMomentum(bot)
        break
      case 'scalping':
        await this.executeScalping(bot)
        break
    }
  }

  private async executeDCA(bot: TradingBot): Promise<void> {
    // Get current market price
    const marketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
    const currentPrice = marketData[0]?.price || 0

    if (currentPrice === 0) return

    // Calculate buy amount based on frequency
    const buyAmount = bot.investment / (bot.config.frequency === 'weekly' ? 4 : 1)
    
    // Execute buy order
    await this.executeTrade(bot, {
      type: 'buy',
      amount: buyAmount / currentPrice,
      price: currentPrice
    })
  }

  private async executeGrid(bot: TradingBot): Promise<void> {
    const marketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
    const currentPrice = marketData[0]?.price || 0

    if (currentPrice === 0) return

    const gridLevels = bot.config.gridLevels || 10
    const gridSpacing = 0.02 // 2% spacing between levels
    
    // Calculate grid levels
    const levels = []
    for (let i = 0; i < gridLevels; i++) {
      const levelPrice = currentPrice * (1 + (i - gridLevels/2) * gridSpacing)
      levels.push(levelPrice)
    }

    // Execute trades based on current price vs grid levels
    const levelAmount = bot.investment / gridLevels
    
    for (const levelPrice of levels) {
      if (currentPrice <= levelPrice) {
        await this.executeTrade(bot, {
          type: 'buy',
          amount: levelAmount / currentPrice,
          price: currentPrice
        })
      } else {
        await this.executeTrade(bot, {
          type: 'sell',
          amount: levelAmount / currentPrice,
          price: currentPrice
        })
      }
    }
  }

  private async executeArbitrage(bot: TradingBot): Promise<void> {
    // Get prices from multiple exchanges
    const exchanges = bot.exchange.split(',')
    const prices = await Promise.all(
      exchanges.map(async (exchange) => {
        // In real implementation, this would fetch from actual exchange APIs
        const marketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
        return { exchange, price: marketData[0]?.price || 0 }
      })
    )

    // Find arbitrage opportunity
    const sortedPrices = prices.sort((a, b) => a.price - b.price)
    const spread = sortedPrices[sortedPrices.length - 1].price - sortedPrices[0].price
    const spreadPercent = (spread / sortedPrices[0].price) * 100

    if (spreadPercent > 0.5) { // 0.5% minimum spread
      // Execute arbitrage
      await this.executeTrade(bot, {
        type: 'buy',
        amount: bot.investment / sortedPrices[0].price,
        price: sortedPrices[0].price
      })

      await this.executeTrade(bot, {
        type: 'sell',
        amount: bot.investment / sortedPrices[0].price,
        price: sortedPrices[sortedPrices.length - 1].price
      })
    }
  }

  private async executeMarketMaking(bot: TradingBot): Promise<void> {
    const marketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
    const currentPrice = marketData[0]?.price || 0

    if (currentPrice === 0) return

    const spread = 0.001 // 0.1% spread
    const bidPrice = currentPrice * (1 - spread/2)
    const askPrice = currentPrice * (1 + spread/2)

    // Place orders on both sides
    await this.executeTrade(bot, {
      type: 'buy',
      amount: bot.investment / bidPrice,
      price: bidPrice
    })

    await this.executeTrade(bot, {
      type: 'sell',
      amount: bot.investment / askPrice,
      price: askPrice
    })
  }

  private async executeMomentum(bot: TradingBot): Promise<void> {
    const marketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
    const currentPrice = marketData[0]?.price || 0
    const change24h = marketData[0]?.changePercent24h || 0

    if (currentPrice === 0) return

    // Momentum strategy: buy on positive momentum, sell on negative
    if (change24h > 5) { // 5% positive momentum
      await this.executeTrade(bot, {
        type: 'buy',
        amount: bot.investment / currentPrice,
        price: currentPrice
      })
    } else if (change24h < -5) { // 5% negative momentum
      await this.executeTrade(bot, {
        type: 'sell',
        amount: bot.investment / currentPrice,
        price: currentPrice
      })
    }
  }

  private async executeScalping(bot: TradingBot): Promise<void> {
    const marketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
    const currentPrice = marketData[0]?.price || 0

    if (currentPrice === 0) return

    // Scalping: small frequent trades
    const tradeAmount = bot.investment * 0.1 // 10% of investment per trade
    
    await this.executeTrade(bot, {
      type: 'buy',
      amount: tradeAmount / currentPrice,
      price: currentPrice
    })

    // Sell after small profit
    setTimeout(async () => {
      const newMarketData = await marketDataService.getMarketData([bot.tradingPair.split('/')[0]])
      const newPrice = newMarketData[0]?.price || currentPrice
      
      if (newPrice > currentPrice * 1.002) { // 0.2% profit
        await this.executeTrade(bot, {
          type: 'sell',
          amount: tradeAmount / currentPrice,
          price: newPrice
        })
      }
    }, 5000) // 5 seconds
  }

  private async executeTrade(bot: TradingBot, tradeData: Omit<Trade, 'id' | 'botId' | 'timestamp'>): Promise<void> {
    const trade: Trade = {
      id: this.generateId(),
      botId: bot.id,
      ...tradeData,
      timestamp: new Date()
    }

    // Calculate PnL for sell trades
    if (trade.type === 'sell') {
      const lastBuyTrade = bot.performance.trades
        .filter(t => t.type === 'buy')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
      
      if (lastBuyTrade) {
        trade.pnl = (trade.price - lastBuyTrade.price) * trade.amount
      }
    }

    // Update bot performance
    bot.performance.trades.push(trade)
    bot.totalTrades++
    bot.lastTradeAt = new Date()

    if (trade.pnl) {
      bot.totalPnL += trade.pnl
      bot.performance.totalPnL += trade.pnl
    }

    bot.performance.totalVolume += trade.amount * trade.price

    // Calculate win rate
    const profitableTrades = bot.performance.trades.filter(t => t.pnl && t.pnl > 0).length
    bot.winRate = (profitableTrades / bot.totalTrades) * 100
    bot.performance.winRate = bot.winRate

    // Update current value
    if (trade.type === 'buy') {
      bot.currentValue += trade.amount * trade.price
    } else {
      bot.currentValue -= trade.amount * trade.price
    }

    await this.saveBots()
  }

  private async testConnection(connection: ExchangeConnection): Promise<void> {
    // In real implementation, this would test the actual exchange API
    // For now, we'll simulate a successful connection
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (Math.random() < 0.1) { // 10% chance of failure
      throw new Error('Connection test failed')
    }
  }

  private startMonitoring(): void {
    // Monitor running bots every 30 seconds
    setInterval(async () => {
      for (const bot of this.bots.values()) {
        if (bot.status === 'running') {
          try {
            await this.executeStrategy(bot)
          } catch (error) {
            console.error(`Error executing strategy for bot ${bot.id}:`, error)
            bot.status = 'error'
            await this.saveBots()
          }
        }
      }
    }, 30000)
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private async loadBots(): Promise<void> {
    // In real implementation, this would load from database
    // For now, we'll start with empty bots
  }

  private async saveBots(): Promise<void> {
    // In real implementation, this would save to database
    // For now, we'll just keep in memory
  }

  private async loadConnections(): Promise<void> {
    // In real implementation, this would load from database
  }

  private async saveConnections(): Promise<void> {
    // In real implementation, this would save to database
  }

  private async initializeConnections(): Promise<void> {
    // In real implementation, this would initialize exchange connections
  }
}

export const tradingEngine = new TradingEngine() 