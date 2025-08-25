export interface MarketData {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  high24h: number
  low24h: number
  lastUpdated: Date
}

export interface PortfolioData {
  totalValue: number
  totalChange24h: number
  totalChangePercent24h: number
  assets: {
    symbol: string
    amount: number
    value: number
    change24h: number
    changePercent24h: number
  }[]
}

class MarketDataService {
  private cache: Map<string, { data: MarketData; timestamp: number }> = new Map()
  private cacheTimeout = 30000 // 30 seconds

  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    const now = Date.now()
    const results: MarketData[] = []

    for (const symbol of symbols) {
      const cached = this.cache.get(symbol)
      
      if (cached && (now - cached.timestamp) < this.cacheTimeout) {
        results.push(cached.data)
        continue
      }

      try {
        const data = await this.fetchMarketData(symbol)
        this.cache.set(symbol, { data, timestamp: now })
        results.push(data)
      } catch (error) {
        console.error(`Failed to fetch market data for ${symbol}:`, error)
        // Return cached data if available, even if expired
        if (cached) {
          results.push(cached.data)
        }
      }
    }

    return results
  }

  private async fetchMarketData(symbol: string): Promise<MarketData> {
    // Use CoinGecko API for real market data
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoinGeckoId(symbol)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_high_24hr=true&include_low_24hr=true`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.statusText}`)
    }

    const data = await response.json()
    const coinId = this.getCoinGeckoId(symbol)
    const coinData = data[coinId]

    return {
      symbol,
      price: coinData.usd,
      change24h: coinData.usd_24h_change || 0,
      changePercent24h: coinData.usd_24h_change || 0,
      volume24h: coinData.usd_24h_vol || 0,
      marketCap: coinData.usd_market_cap || 0,
      high24h: coinData.usd_24h_high || coinData.usd,
      low24h: coinData.usd_24h_low || coinData.usd,
      lastUpdated: new Date()
    }
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'ADA': 'cardano',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'DOT': 'polkadot',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'AAVE': 'aave',
      'CRV': 'curve-dao-token',
      'SUSHI': 'sushi',
      'PANC': 'pancakeswap-token',
      'RAY': 'raydium',
      'JUP': 'jupiter',
      '1INCH': '1inch',
      'DYDX': 'dydx',
      'LOOP': 'loopring',
      'BAL': 'balancer',
      'COMP': 'compound-governance-token'
    }
    
    return mapping[symbol] || symbol.toLowerCase()
  }

  async getPortfolioData(holdings: { symbol: string; amount: number }[]): Promise<PortfolioData> {
    const symbols = holdings.map(h => h.symbol)
    const marketData = await this.getMarketData(symbols)
    
    let totalValue = 0
    let totalChange24h = 0
    const assets = holdings.map(holding => {
      const market = marketData.find(m => m.symbol === holding.symbol)
      if (!market) return null
      
      const value = holding.amount * market.price
      const change24h = holding.amount * market.change24h
      
      totalValue += value
      totalChange24h += change24h
      
      return {
        symbol: holding.symbol,
        amount: holding.amount,
        value,
        change24h,
        changePercent24h: market.changePercent24h
      }
    }).filter(Boolean) as PortfolioData['assets']

    return {
      totalValue,
      totalChange24h,
      totalChangePercent24h: totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0,
      assets
    }
  }

  // Get trending coins for suggestions
  async getTrendingCoins(): Promise<{ symbol: string; name: string; price: number; changePercent24h: number }[]> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/search/trending')
      const data = await response.json()
      
      const bitcoinPrice = await this.getBitcoinPrice()
      return data.coins.slice(0, 10).map((coin: any) => ({
        symbol: coin.item.symbol.toUpperCase(),
        name: coin.item.name,
        price: coin.item.price_btc * bitcoinPrice,
        changePercent24h: coin.item.data?.price_change_percentage_24h?.usd || 0
      }))
    } catch (error) {
      console.error('Failed to fetch trending coins:', error)
      return []
    }
  }

  private async getBitcoinPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      const data = await response.json()
      return data.bitcoin.usd
    } catch {
      return 45000 // Fallback price
    }
  }
}

export const marketDataService = new MarketDataService() 