export interface GatewayConfig {
  baseUrl: string;
}

export interface Pool {
  type: 'amm' | 'clmm';
  network: string;
  baseSymbol: string;
  quoteSymbol: string;
  address: string;
}

export interface Token {
  symbol: string;
  name: string;
  address: string;
  network: string;
  decimals: number;
  logoURI?: string;
}

export interface Wallet {
  address: string;
  network: string;
  balance: string;
  tokens: Token[];
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'liquidity' | 'lending' | 'yield';
  network: string;
  pool: Pool;
  value: string;
  apy: number;
  rewards: string;
  status: 'active' | 'inactive';
  risk: 'low' | 'medium' | 'high';
}

export class GatewayClient {
  private config: GatewayConfig;

  constructor(config: GatewayConfig) {
    this.config = config;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gateway API request failed:', error);
      throw error;
    }
  }

  // Configuration
  async getConfig(): Promise<any> {
    return this.request('/config');
  }

  // Pools
  async getPools(connector: string): Promise<Pool[]> {
    return this.request(`/pools?connector=${connector}`);
  }

  async getPoolInfo(connector: string, poolAddress: string): Promise<any> {
    return this.request(`/pools/${poolAddress}?connector=${connector}`);
  }

  // Tokens
  async getTokens(): Promise<Token[]> {
    const response = await this.request('/tokens');
    return response.tokens || [];
  }

  async addToken(token: Omit<Token, 'id'>): Promise<Token> {
    return this.request('/tokens', {
      method: 'POST',
      body: JSON.stringify(token),
    });
  }

  async getToken(symbol: string): Promise<Token> {
    return this.request(`/tokens/${symbol}`);
  }

  async removeToken(symbol: string): Promise<void> {
    return this.request(`/tokens/${symbol}`, {
      method: 'DELETE',
    });
  }

  // Wallets
  async getWallets(): Promise<Wallet[]> {
    return this.request('/wallet');
  }

  async addWallet(wallet: Omit<Wallet, 'id'>): Promise<Wallet> {
    return this.request('/wallet', {
      method: 'POST',
      body: JSON.stringify(wallet),
    });
  }

  async getWalletBalance(address: string, network: string): Promise<any> {
    return this.request(`/wallet/${address}/balance?network=${network}`);
  }

  // DEX Connectors
  async getUniswapPools(): Promise<Pool[]> {
    return this.getPools('uniswap');
  }

  async getJupiterPools(): Promise<Pool[]> {
    return this.getPools('jupiter');
  }

  async getMeteoraPools(): Promise<Pool[]> {
    return this.getPools('meteora');
  }

  async getRaydiumPools(): Promise<Pool[]> {
    return this.getPools('raydium');
  }

  async get0xPools(): Promise<Pool[]> {
    return this.getPools('0x');
  }

  // Trading
  async getQuote(
    connector: string,
    fromToken: string,
    toToken: string,
    amount: string,
    network: string
  ): Promise<any> {
    return this.request(
      `/quote?connector=${connector}&fromToken=${fromToken}&toToken=${toToken}&amount=${amount}&network=${network}`
    );
  }

  async executeTrade(
    connector: string,
    fromToken: string,
    toToken: string,
    amount: string,
    network: string,
    walletAddress: string
  ): Promise<any> {
    return this.request('/trade', {
      method: 'POST',
      body: JSON.stringify({
        connector,
        fromToken,
        toToken,
        amount,
        network,
        walletAddress,
      }),
    });
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request('/');
      return response.status === 'ok';
    } catch {
      return false;
    }
  }

  // Get all available connectors
  async getAvailableConnectors(): Promise<string[]> {
    return ['uniswap', 'jupiter', 'meteora', 'raydium', '0x'];
  }

  // Get all available networks
  async getAvailableNetworks(): Promise<string[]> {
    const config = await this.getConfig();
    return Object.keys(config).filter(key => 
      key.includes('ethereum-') || key.includes('solana-')
    );
  }
}

// Factory function
export function createGatewayClient(config: GatewayConfig): GatewayClient {
  return new GatewayClient(config);
} 