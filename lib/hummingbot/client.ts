import { EventEmitter } from 'events';

export interface HummingbotConfig {
  gatewayUrl: string;
  apiKey: string;
  apiSecret: string;
  userId: string;
}

export interface BotStrategy {
  id: string;
  name: string;
  strategy: string;
  config: Record<string, any>;
  status: 'running' | 'stopped' | 'error';
  exchange: string;
  tradingPair: string;
  createdAt: Date;
  updatedAt: Date;
  performance?: {
    totalPnL: number;
    totalVolume: number;
    winRate: number;
  };
}

export interface ExchangeConfig {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  sandbox: boolean;
  userId: string;
  createdAt: Date;
}

export interface BotEvent {
  type: 'status_change' | 'trade_executed' | 'error' | 'performance_update';
  botId: string;
  data: any;
  timestamp: Date;
}

export class HummingbotClient extends EventEmitter {
  private config: HummingbotConfig;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(config: HummingbotConfig) {
    super();
    this.config = config;
  }

  // REST API Methods
  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.gatewayUrl}${endpoint}`;
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
      console.error('Hummingbot API request failed:', error);
      throw error;
    }
  }

  // Bot Management
  async createBot(strategy: Omit<BotStrategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<BotStrategy> {
    return this.request('/bots', {
      method: 'POST',
      body: JSON.stringify(strategy),
    });
  }

  async getBots(): Promise<BotStrategy[]> {
    return this.request('/bots');
  }

  async getBot(botId: string): Promise<BotStrategy> {
    return this.request(`/bots/${botId}`);
  }

  async updateBot(botId: string, updates: Partial<BotStrategy>): Promise<BotStrategy> {
    return this.request(`/bots/${botId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBot(botId: string): Promise<void> {
    return this.request(`/bots/${botId}`, {
      method: 'DELETE',
    });
  }

  async startBot(botId: string): Promise<void> {
    return this.request(`/bots/${botId}/start`, {
      method: 'POST',
    });
  }

  async stopBot(botId: string): Promise<void> {
    return this.request(`/bots/${botId}/stop`, {
      method: 'POST',
    });
  }

  async getBotLogs(botId: string, limit = 100): Promise<any[]> {
    return this.request(`/bots/${botId}/logs?limit=${limit}`);
  }

  async getBotPerformance(botId: string): Promise<any> {
    return this.request(`/bots/${botId}/performance`);
  }

  // Exchange Management
  async addExchange(config: Omit<ExchangeConfig, 'id' | 'createdAt'>): Promise<ExchangeConfig> {
    return this.request('/exchanges', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getExchanges(): Promise<ExchangeConfig[]> {
    return this.request('/exchanges');
  }

  async getExchange(exchangeId: string): Promise<ExchangeConfig> {
    return this.request(`/exchanges/${exchangeId}`);
  }

  async updateExchange(exchangeId: string, updates: Partial<ExchangeConfig>): Promise<ExchangeConfig> {
    return this.request(`/exchanges/${exchangeId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteExchange(exchangeId: string): Promise<void> {
    return this.request(`/exchanges/${exchangeId}`, {
      method: 'DELETE',
    });
  }

  // Strategy Templates
  async getStrategyTemplates(): Promise<any[]> {
    return this.request('/strategies/templates');
  }

  async getStrategyConfig(strategyName: string): Promise<any> {
    return this.request(`/strategies/${strategyName}/config`);
  }

  // WebSocket Connection for Real-time Updates
  connectWebSocket(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = this.config.gatewayUrl.replace('http', 'ws') + '/ws';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Hummingbot WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Authenticate WebSocket connection
      this.ws?.send(JSON.stringify({
        type: 'auth',
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret,
        userId: this.config.userId,
      }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Hummingbot WebSocket disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('Hummingbot WebSocket error:', error);
    };
  }

  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'bot_status':
        this.emit('botStatus', data);
        break;
      case 'trade_executed':
        this.emit('tradeExecuted', data);
        break;
      case 'error':
        this.emit('error', data);
        break;
      case 'performance_update':
        this.emit('performanceUpdate', data);
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connectWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Utility Methods
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }

  async getSystemStatus(): Promise<any> {
    return this.request('/system/status');
  }

  async getAvailableExchanges(): Promise<string[]> {
    return this.request('/exchanges/available');
  }

  async getTradingPairs(exchange: string): Promise<string[]> {
    return this.request(`/exchanges/${exchange}/pairs`);
  }
}

// Factory function for creating client instances
export function createHummingbotClient(config: HummingbotConfig): HummingbotClient {
  return new HummingbotClient(config);
} 