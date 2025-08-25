"use client"

import { useState, useEffect } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Play, Square, Trash2, Plus, Settings, TrendingUp, TrendingDown } from "lucide-react"

interface Bot {
  id: string;
  name: string;
  strategy: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  exchange: string;
  tradingPair: string;
  investment: number;
  currentValue: number;
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  createdAt: Date;
  performance: {
    totalPnL: number;
    totalVolume: number;
    winRate: number;
    totalTrades: number;
  };
}

export default function BotsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBotData, setNewBotData] = useState({
    name: '',
    strategy: '',
    exchange: '',
    tradingPair: '',
    investment: '',
  });

  useEffect(() => {
    if (user) {
      fetchBots();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const response = await fetch('/api/trading/bots', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Map common errors to actionable messages
        if (response.status === 401) {
          setError('Please log in to view your bots.');
          return;
        }
        if (response.status === 503) {
          setError('Trading service not available. Server config (Firebase Admin) missing.');
          return;
        }
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to fetch bots');
      }

      const data = await response.json();
      setBots(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bots';
      setError(message);
      toast({
        title: "Error",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBot = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/trading/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newBotData,
          investment: parseFloat(newBotData.investment),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to create bot');
      }

      const newBot = await response.json();
      setBots(prev => [...prev, newBot]);
      setIsCreateDialogOpen(false);
      setNewBotData({
        name: '',
        strategy: '',
        exchange: '',
        tradingPair: '',
        investment: '',
      });

      toast({
        title: "Success",
        description: "Bot created successfully",
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create bot';
      toast({
        title: "Error",
        description: message,
        type: "error",
      });
    }
  };

  const handleToggleBot = async (botId: string, action: 'start' | 'stop') => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/trading/bots/${botId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || `Failed to ${action} bot`);
      }

      // Update local state
      setBots(prev => prev.map(bot => 
        bot.id === botId 
          ? { ...bot, status: action === 'start' ? 'running' : 'stopped' }
          : bot
      ));

      toast({
        title: "Success",
        description: `Bot ${action}ed successfully`,
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to ${action} bot`;
      toast({
        title: "Error",
        description: message,
        type: "error",
      });
    }
  };

  const handleDeleteBot = async (botId: string) => {
    if (!confirm('Are you sure you want to delete this bot?')) return;

    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/trading/bots/${botId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to delete bot');
      }

      setBots(prev => prev.filter(bot => bot.id !== botId));
      toast({
        title: "Success",
        description: "Bot deleted successfully",
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete bot';
      toast({
        title: "Error",
        description: message,
        type: "error",
      });
    }
  };

  // Calculate stats
  const totalBots = bots.length;
  const activeBots = bots.filter(bot => bot.status === 'running').length;
  const totalInvestment = bots.reduce((sum, bot) => sum + bot.investment, 0);
  const totalPnL = bots.reduce((sum, bot) => sum + bot.totalPnL, 0);

  const botStats = [
    {
      label: "TOTAL BOTS",
      value: totalBots.toString(),
      description: "CREATED",
    },
    {
      label: "ACTIVE BOTS",
      value: activeBots.toString(),
      description: "RUNNING",
    },
    {
      label: "TOTAL INVESTMENT",
      value: `$${totalInvestment.toLocaleString()}`,
      description: "ACROSS ALL BOTS",
    },
    {
      label: "TOTAL P&L",
      value: `$${totalPnL.toFixed(2)}`,
      description: "ALL TIME",
    },
  ];

  if (loading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Trading Bots",
          description: "Manage your automated trading strategies",
          icon: Settings,
        }}
      >
        <div className="flex items-center justify-center h-64">
          <p>Loading bots...</p>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Trading Bots",
        description: "Manage your automated trading strategies",
        icon: Settings,
      }}
    >
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {botStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Bot Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <Plus className="mr-2 size-4" />
            Create New Bot
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Trading Bot</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={newBotData.name}
                onChange={(e) => setNewBotData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My DCA Bot"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={newBotData.strategy} onValueChange={(value) => setNewBotData(prev => ({ ...prev, strategy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dca">Dollar Cost Averaging</SelectItem>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="arbitrage">Arbitrage</SelectItem>
                  <SelectItem value="market_making">Market Making</SelectItem>
                  <SelectItem value="momentum">Momentum Trading</SelectItem>
                  <SelectItem value="scalping">Scalping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Input
                id="exchange"
                value={newBotData.exchange}
                onChange={(e) => setNewBotData(prev => ({ ...prev, exchange: e.target.value }))}
                placeholder="binance"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tradingPair">Trading Pair</Label>
              <Input
                id="tradingPair"
                value={newBotData.tradingPair}
                onChange={(e) => setNewBotData(prev => ({ ...prev, tradingPair: e.target.value }))}
                placeholder="BTC/USDT"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                type="number"
                value={newBotData.investment}
                onChange={(e) => setNewBotData(prev => ({ ...prev, investment: e.target.value }))}
                placeholder="1000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBot}>
              Create Bot
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bots List */}
      <div className="space-y-6">
        {bots.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="size-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No trading bots</h3>
            <p className="text-muted-foreground mb-4">Create your first bot to start automated trading</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 size-4" />
              Create Bot
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bots.map((bot) => (
              <Card key={bot.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                        <Settings className="size-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display">{bot.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        bot.status === 'running' ? 'default' : 
                        bot.status === 'paused' ? 'secondary' : 
                        bot.status === 'error' ? 'destructive' : 'outline'
                      }
                      className="text-xs"
                    >
                      {bot.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bot Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Exchange</p>
                      <p className="font-mono text-lg">{bot.exchange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Pair</p>
                      <p className="font-mono text-lg">{bot.tradingPair}</p>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Investment:</span>
                      <span className="font-mono">${bot.investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Value:</span>
                      <span className="font-mono">${bot.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">P&L:</span>
                      <span className={`font-mono flex items-center gap-1 ${bot.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bot.totalPnL >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        ${bot.totalPnL.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trades:</span>
                      <span className="font-mono">{bot.totalTrades}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Win Rate:</span>
                      <span className="font-mono">{(bot.winRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {bot.status === 'running' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleBot(bot.id, 'stop')}
                      >
                        <Square className="mr-2 size-4" />
                        Stop
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleBot(bot.id, 'start')}
                      >
                        <Play className="mr-2 size-4" />
                        Start
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteBot(bot.id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardPageLayout>
  )
}
