import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { BotStrategy, ExchangeConfig } from '@/lib/hummingbot/client';

interface UseHummingbotReturn {
  bots: BotStrategy[];
  exchanges: ExchangeConfig[];
  loading: boolean;
  error: string | null;
  createBot: (botData: Omit<BotStrategy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBot: (botId: string, updates: Partial<BotStrategy>) => Promise<void>;
  deleteBot: (botId: string) => Promise<void>;
  startBot: (botId: string) => Promise<void>;
  stopBot: (botId: string) => Promise<void>;
  addExchange: (exchangeData: Omit<ExchangeConfig, 'id' | 'createdAt'>) => Promise<void>;
  updateExchange: (exchangeId: string, updates: Partial<ExchangeConfig>) => Promise<void>;
  deleteExchange: (exchangeId: string) => Promise<void>;
  refreshBots: () => Promise<void>;
  refreshExchanges: () => Promise<void>;
}

export function useHummingbot(): UseHummingbotReturn {
  const { user } = useAuth();
  const [bots, setBots] = useState<BotStrategy[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = useCallback(async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, [user]);

  const refreshBots = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const botsData = await handleApiCall<BotStrategy[]>('/api/hummingbot/bots');
      setBots(botsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bots');
    } finally {
      setLoading(false);
    }
  }, [user, handleApiCall]);

  const refreshExchanges = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const exchangesData = await handleApiCall<ExchangeConfig[]>('/api/hummingbot/exchanges');
      setExchanges(exchangesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exchanges');
    } finally {
      setLoading(false);
    }
  }, [user, handleApiCall]);

  const createBot = useCallback(async (botData: Omit<BotStrategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      const newBot = await handleApiCall<BotStrategy>('/api/hummingbot/bots', {
        method: 'POST',
        body: JSON.stringify(botData),
      });
      
      setBots(prev => [...prev, newBot]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bot');
      throw err;
    }
  }, [user, handleApiCall]);

  const updateBot = useCallback(async (botId: string, updates: Partial<BotStrategy>) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      const updatedBot = await handleApiCall<BotStrategy>(`/api/hummingbot/bots/${botId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      setBots(prev => prev.map(bot => bot.id === botId ? updatedBot : bot));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bot');
      throw err;
    }
  }, [user, handleApiCall]);

  const deleteBot = useCallback(async (botId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      await handleApiCall(`/api/hummingbot/bots/${botId}`, {
        method: 'DELETE',
      });
      
      setBots(prev => prev.filter(bot => bot.id !== botId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bot');
      throw err;
    }
  }, [user, handleApiCall]);

  const startBot = useCallback(async (botId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      await handleApiCall(`/api/hummingbot/bots/${botId}/start`, {
        method: 'POST',
      });
      
      setBots(prev => prev.map(bot => 
        bot.id === botId ? { ...bot, status: 'running' as const } : bot
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start bot');
      throw err;
    }
  }, [user, handleApiCall]);

  const stopBot = useCallback(async (botId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      await handleApiCall(`/api/hummingbot/bots/${botId}/stop`, {
        method: 'POST',
      });
      
      setBots(prev => prev.map(bot => 
        bot.id === botId ? { ...bot, status: 'stopped' as const } : bot
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop bot');
      throw err;
    }
  }, [user, handleApiCall]);

  const addExchange = useCallback(async (exchangeData: Omit<ExchangeConfig, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      const newExchange = await handleApiCall<ExchangeConfig>('/api/hummingbot/exchanges', {
        method: 'POST',
        body: JSON.stringify(exchangeData),
      });
      
      setExchanges(prev => [...prev, newExchange]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add exchange');
      throw err;
    }
  }, [user, handleApiCall]);

  const updateExchange = useCallback(async (exchangeId: string, updates: Partial<ExchangeConfig>) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      const updatedExchange = await handleApiCall<ExchangeConfig>(`/api/hummingbot/exchanges/${exchangeId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      setExchanges(prev => prev.map(exchange => 
        exchange.id === exchangeId ? updatedExchange : exchange
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exchange');
      throw err;
    }
  }, [user, handleApiCall]);

  const deleteExchange = useCallback(async (exchangeId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setError(null);
    
    try {
      await handleApiCall(`/api/hummingbot/exchanges/${exchangeId}`, {
        method: 'DELETE',
      });
      
      setExchanges(prev => prev.filter(exchange => exchange.id !== exchangeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exchange');
      throw err;
    }
  }, [user, handleApiCall]);

  // Load initial data
  useEffect(() => {
    if (user) {
      refreshBots();
      refreshExchanges();
    }
  }, [user, refreshBots, refreshExchanges]);

  return {
    bots,
    exchanges,
    loading,
    error,
    createBot,
    updateBot,
    deleteBot,
    startBot,
    stopBot,
    addExchange,
    updateExchange,
    deleteExchange,
    refreshBots,
    refreshExchanges,
  };
} 