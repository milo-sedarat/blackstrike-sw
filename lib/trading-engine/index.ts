import { createGatewayClient } from '@/lib/gateway/client';

export interface TradingBot {
  id: string;
  name: string;
  strategy: 'dca' | 'grid' | 'arbitrage' | 'market_making' | 'momentum' | 'scalping';
  status: 'running' | 'stopped' | 'paused' | 'error';
  exchange: string;
  tradingPair: string;
  investment: number;
  currentValue: number;
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  createdAt: Date;
  lastTradeAt?: Date;
  config: BotConfig;
  performance: BotPerformance;
}

export interface BotConfig {
  // DCA Strategy
  dcaInterval?: number; // minutes
  dcaAmount?: number;
  
  // Grid Strategy
  gridUpperPrice?: number;
  gridLowerPrice?: number;
  gridLevels?: number;
  
  // Arbitrage Strategy
  minSpread?: number;
  maxSlippage?: number;
  
  // Market Making
  bidSpread?: number;
  askSpread?: number;
  orderRefreshTime?: number;
  
  // General
  maxPositionSize?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface BotPerformance {
  totalPnL: number;
  totalVolume: number;
  winRate: number;
  totalTrades: number;
  averageTradeSize: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface ExchangeConnection {
  id: string;
  name: string;
  type: 'cex' | 'dex';
  status: 'connected' | 'disconnected' | 'error';
  balance: number;
  lastSync: Date;
  apiKey?: string;
  apiSecret?: string;
  passphrase?: string;
}

export interface Trade {
  id: string;
  botId: string;
  exchange: string;
  tradingPair: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: Date;
  status: 'pending' | 'filled' | 'cancelled' | 'failed';
  fee: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export class TradingEngine {
  private gatewayClient: any;
  private bots: Map<string, TradingBot> = new Map();
  private connections: Map<string, ExchangeConnection> = new Map();
  private trades: Map<string, Trade> = new Map();
  private marketData: Map<string, MarketData> = new Map();

  constructor() {
    this.gatewayClient = createGatewayClient({
      baseUrl: process.env.GATEWAY_URL || 'http://localhost:15888',
    });
  }

  // Bot Management
  async createBot(botData: Omit<TradingBot, 'id' | 'createdAt' | 'updatedAt'>): Promise<TradingBot> {
    const id = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const bot: TradingBot = {
      ...botData,
      id,
      createdAt: new Date(),
      lastTradeAt: undefined,
      config: botData.config || {},
      performance: {
        totalPnL: 0,
        totalVolume: 0,
        winRate: 0,
        totalTrades: 0,
        averageTradeSize: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
      },
    };

    this.bots.set(id, bot);
    return bot;
  }

  async getBots(): Promise<TradingBot[]> {
    return Array.from(this.bots.values());
  }

  async getBot(botId: string): Promise<TradingBot | null> {
    return this.bots.get(botId) || null;
  }

  async updateBot(botId: string, updates: Partial<TradingBot>): Promise<TradingBot | null> {
    const bot = this.bots.get(botId);
    if (!bot) return null;

    const updatedBot = { ...bot, ...updates };
    this.bots.set(botId, updatedBot);
    return updatedBot;
  }

  async deleteBot(botId: string): Promise<boolean> {
    return this.bots.delete(botId);
  }

  // Bot Control
  async startBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.status = 'running';
    this.bots.set(botId, bot);
    
    // Start the bot's strategy execution
    this.executeBotStrategy(botId);
    return true;
  }

  async stopBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.status = 'stopped';
    this.bots.set(botId, bot);
    return true;
  }

  async pauseBot(botId: string): Promise<boolean> {
    const bot = this.bots.get(botId);
    if (!bot) return false;

    bot.status = 'paused';
    this.bots.set(botId, bot);
    return true;
  }

  // Exchange Connections
  async connectExchange(connection: Omit<ExchangeConnection, 'id' | 'lastSync'>): Promise<ExchangeConnection> {
    const id = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exchangeConnection: ExchangeConnection = {
      ...connection,
      id,
      lastSync: new Date(),
    };

    this.connections.set(id, exchangeConnection);
    return exchangeConnection;
  }

  async getConnections(): Promise<ExchangeConnection[]> {
    return Array.from(this.connections.values());
  }

  async disconnectExchange(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId);
    if (!connection) return false;

    connection.status = 'disconnected';
    this.connections.set(connectionId, connection);
    return true;
  }

  // Trading
  async executeTrade(trade: Omit<Trade, 'id' | 'timestamp'>): Promise<Trade> {
    const id = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTrade: Trade = {
      ...trade,
      id,
      timestamp: new Date(),
    };

    this.trades.set(id, newTrade);
    
    // Update bot performance
    await this.updateBotPerformance(trade.botId, newTrade);
    
    return newTrade;
  }

  async getTrades(botId?: string): Promise<Trade[]> {
    const trades = Array.from(this.trades.values());
    if (botId) {
      return trades.filter(trade => trade.botId === botId);
    }
    return trades;
  }

  // Market Data
  async getMarketData(symbol: string): Promise<MarketData | null> {
    return this.marketData.get(symbol) || null;
  }

  async updateMarketData(symbol: string, data: Partial<MarketData>): Promise<void> {
    const existing = this.marketData.get(symbol);
    this.marketData.set(symbol, {
      symbol,
      price: 0,
      volume24h: 0,
      change24h: 0,
      high24h: 0,
      low24h: 0,
      timestamp: new Date(),
      ...existing,
      ...data,
    });
  }

  // Strategy Execution
  private async executeBotStrategy(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot || bot.status !== 'running') return;

    try {
      switch (bot.strategy) {
        case 'dca':
          await this.executeDCAStrategy(bot);
          break;
        case 'grid':
          await this.executeGridStrategy(bot);
          break;
        case 'arbitrage':
          await this.executeArbitrageStrategy(bot);
          break;
        case 'market_making':
          await this.executeMarketMakingStrategy(bot);
          break;
        case 'momentum':
          await this.executeMomentumStrategy(bot);
          break;
        case 'scalping':
          await this.executeScalpingStrategy(bot);
          break;
      }
    } catch (error) {
      console.error(`Error executing strategy for bot ${botId}:`, error);
      bot.status = 'error';
      this.bots.set(botId, bot);
    }
  }

  private async executeDCAStrategy(bot: TradingBot): Promise<void> {
    // Dollar Cost Averaging strategy
    const config = bot.config;
    const interval = config.dcaInterval || 60; // 1 hour default
    const amount = config.dcaAmount || 100; // $100 default

    // Check if it's time to execute DCA
    const now = new Date();
    const lastTrade = bot.lastTradeAt;
    const timeSinceLastTrade = lastTrade ? now.getTime() - lastTrade.getTime() : interval * 60 * 1000;

    if (timeSinceLastTrade >= interval * 60 * 1000) {
      // Execute DCA trade
      await this.executeTrade({
        botId: bot.id,
        exchange: bot.exchange,
        tradingPair: bot.tradingPair,
        side: 'buy',
        amount: amount,
        price: await this.getCurrentPrice(bot.tradingPair),
        status: 'filled',
        fee: amount * 0.001, // 0.1% fee
      });

      bot.lastTradeAt = now;
      this.bots.set(bot.id, bot);
    }
  }

  private async executeGridStrategy(bot: TradingBot): Promise<void> {
    // Grid trading strategy
    const config = bot.config;
    const upperPrice = config.gridUpperPrice || 50000;
    const lowerPrice = config.gridLowerPrice || 40000;
    const levels = config.gridLevels || 10;
    const currentPrice = await this.getCurrentPrice(bot.tradingPair);

    if (currentPrice <= lowerPrice || currentPrice >= upperPrice) {
      // Price outside grid bounds, adjust grid
      return;
    }

    // Calculate grid levels and execute trades
    const gridStep = (upperPrice - lowerPrice) / levels;
    const currentLevel = Math.floor((currentPrice - lowerPrice) / gridStep);

    // Execute grid trades based on price movement
    // This is a simplified implementation
  }

  private async executeArbitrageStrategy(bot: TradingBot): Promise<void> {
    // Cross-exchange arbitrage strategy
    const config = bot.config;
    const minSpread = config.minSpread || 0.01; // 1% minimum spread

    // Get prices from multiple exchanges
    const prices = await this.getPricesFromMultipleExchanges(bot.tradingPair);
    
    if (prices.length < 2) return;

    // Find arbitrage opportunity
    const minPrice = Math.min(...prices.map(p => p.price));
    const maxPrice = Math.max(...prices.map(p => p.price));
    const spread = (maxPrice - minPrice) / minPrice;

    if (spread >= minSpread) {
      // Execute arbitrage trade
      const buyExchange = prices.find(p => p.price === minPrice)?.exchange;
      const sellExchange = prices.find(p => p.price === maxPrice)?.exchange;

      if (buyExchange && sellExchange) {
        // Execute buy and sell trades
        await this.executeTrade({
          botId: bot.id,
          exchange: buyExchange,
          tradingPair: bot.tradingPair,
          side: 'buy',
          amount: bot.investment * 0.5,
          price: minPrice,
          status: 'filled',
          fee: bot.investment * 0.5 * 0.001,
        });

        await this.executeTrade({
          botId: bot.id,
          exchange: sellExchange,
          tradingPair: bot.tradingPair,
          side: 'sell',
          amount: bot.investment * 0.5,
          price: maxPrice,
          status: 'filled',
          fee: bot.investment * 0.5 * 0.001,
        });
      }
    }
  }

  private async executeMarketMakingStrategy(bot: TradingBot): Promise<void> {
    // Market making strategy
    const config = bot.config;
    const bidSpread = config.bidSpread || 0.001; // 0.1% bid spread
    const askSpread = config.askSpread || 0.001; // 0.1% ask spread
    const currentPrice = await this.getCurrentPrice(bot.tradingPair);

    const bidPrice = currentPrice * (1 - bidSpread);
    const askPrice = currentPrice * (1 + askSpread);

    // Place bid and ask orders
    // This is a simplified implementation
  }

  private async executeMomentumStrategy(bot: TradingBot): Promise<void> {
    // Momentum trading strategy
    const currentPrice = await this.getCurrentPrice(bot.tradingPair);
    const historicalPrices = await this.getHistoricalPrices(bot.tradingPair, 24); // 24 hours

    if (historicalPrices.length < 2) return;

    const priceChange = (currentPrice - historicalPrices[0]) / historicalPrices[0];
    const momentum = priceChange > 0.02; // 2% positive momentum

    if (momentum) {
      // Execute momentum trade
      await this.executeTrade({
        botId: bot.id,
        exchange: bot.exchange,
        tradingPair: bot.tradingPair,
        side: 'buy',
        amount: bot.investment * 0.1, // 10% of investment
        price: currentPrice,
        status: 'filled',
        fee: bot.investment * 0.1 * 0.001,
      });
    }
  }

  private async executeScalpingStrategy(bot: TradingBot): Promise<void> {
    // Scalping strategy
    const currentPrice = await this.getCurrentPrice(bot.tradingPair);
    const config = bot.config;
    const takeProfit = config.takeProfit || 0.005; // 0.5% take profit
    const stopLoss = config.stopLoss || 0.003; // 0.3% stop loss

    // Execute scalping trades based on small price movements
    // This is a simplified implementation
  }

  // Helper methods
  private async getCurrentPrice(symbol: string): Promise<number> {
    const marketData = this.marketData.get(symbol);
    return marketData?.price || 0;
  }

  private async getPricesFromMultipleExchanges(symbol: string): Promise<Array<{exchange: string, price: number}>> {
    // Simulate getting prices from multiple exchanges
    return [
      { exchange: 'binance', price: 45000 },
      { exchange: 'coinbase', price: 45100 },
      { exchange: 'kraken', price: 44950 },
    ];
  }

  private async getHistoricalPrices(symbol: string, hours: number): Promise<number[]> {
    // Simulate historical price data
    return [44000, 44200, 44500, 44800, 45000];
  }

  private async updateBotPerformance(botId: string, trade: Trade): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) return;

    const performance = bot.performance;
    performance.totalTrades += 1;
    performance.totalVolume += trade.amount * trade.price;

    // Calculate P&L (simplified)
    if (trade.side === 'sell') {
      performance.totalPnL += trade.amount * trade.price * 0.01; // Simulate profit
    }

    performance.winRate = performance.totalPnL > 0 ? 0.6 : 0.4; // Simplified win rate
    performance.averageTradeSize = performance.totalVolume / performance.totalTrades;

    bot.performance = performance;
    this.bots.set(botId, bot);
  }

  // System methods
  async initialize(): Promise<void> {
    // Initialize the trading engine
    console.log('Trading engine initialized');
  }

  async shutdown(): Promise<void> {
    // Stop all running bots
    for (const [botId, bot] of this.bots) {
      if (bot.status === 'running') {
        await this.stopBot(botId);
      }
    }
    console.log('Trading engine shutdown complete');
  }
}

// Factory function
export function createTradingEngine(): TradingEngine {
  return new TradingEngine();
} 