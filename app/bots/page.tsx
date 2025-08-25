"use client"

import { useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import CuteRobotIcon from "@/components/icons/cute-robot"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import Image from "next/image"
import { useHummingbot } from "@/hooks/use-hummingbot"
import { BotStrategy } from "@/lib/hummingbot/client"



export default function MyBotsPage() {
  const { bots, loading, error, createBot, startBot, stopBot, deleteBot } = useHummingbot();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBotData, setNewBotData] = useState({
    name: '',
    strategy: '',
    exchange: '',
    tradingPair: '',
    config: {},
    status: 'stopped' as const,
  });

  // Calculate stats from real bot data
  const totalBots = bots.length;
  const activeBots = bots.filter(bot => bot.status === 'running').length;
  const totalProfit = bots.reduce((sum, bot) => sum + (bot.performance?.totalPnL || 0), 0);

  const botStats = [
    {
      label: "TOTAL BOTS",
      value: totalBots.toString(),
      description: "CREATED STRATEGIES",
      icon: CuteRobotIcon,
    },
    {
      label: "ACTIVE BOTS",
      value: activeBots.toString(),
      description: "CURRENTLY RUNNING",
      icon: ProcessorIcon,
    },
    {
      label: "TOTAL PROFIT",
      value: `$${totalProfit.toFixed(2)}`,
      description: "ALL TIME EARNINGS",
      icon: GearIcon,
    },
  ];

  const handleCreateBot = async () => {
    try {
      await createBot(newBotData);
      setIsCreateDialogOpen(false);
      setNewBotData({ name: '', strategy: '', exchange: '', tradingPair: '', config: {}, status: 'stopped' as const });
      toast({ title: 'Bot created successfully', type: 'success' });
    } catch (err) {
      toast({ title: 'Failed to create bot', description: err instanceof Error ? err.message : 'Unknown error', type: 'error' });
    }
  };

  const handleToggleBot = async (bot: BotStrategy) => {
    try {
      if (bot.status === 'running') {
        await stopBot(bot.id);
        toast({ title: 'Bot stopped', type: 'success' });
      } else {
        await startBot(bot.id);
        toast({ title: 'Bot started', type: 'success' });
      }
    } catch (err) {
      toast({ title: 'Failed to toggle bot', description: err instanceof Error ? err.message : 'Unknown error', type: 'error' });
    }
  };

  const handleDeleteBot = async (botId: string) => {
    try {
      await deleteBot(botId);
      toast({ title: 'Bot deleted', type: 'success' });
    } catch (err) {
      toast({ title: 'Failed to delete bot', description: err instanceof Error ? err.message : 'Unknown error', type: 'error' });
    }
  };

  if (loading) {
    return (
      <DashboardPageLayout
        header={{
          title: "My Bots",
          description: "Manage your trading strategies",
          icon: CuteRobotIcon,
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
        title: "My Bots",
        description: "Manage your trading strategies",
        icon: CuteRobotIcon,
      }}
    >
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {botStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase">{stat.description}</p>
                </div>
                <stat.icon className="size-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Bot Button */}
      <div className="mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="font-display">
              <CuteRobotIcon className="mr-2 size-4" />
              Create New Bot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Trading Bot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Bot Name</Label>
                <Input
                  id="name"
                  value={newBotData.name}
                  onChange={(e) => setNewBotData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Trading Bot"
                />
              </div>
              <div>
                <Label htmlFor="strategy">Strategy</Label>
                <Select value={newBotData.strategy} onValueChange={(value) => setNewBotData(prev => ({ ...prev, strategy: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid_trading">Grid Trading</SelectItem>
                    <SelectItem value="dca">Dollar Cost Average</SelectItem>
                    <SelectItem value="momentum">Momentum Trading</SelectItem>
                    <SelectItem value="arbitrage">Cross-Exchange Arbitrage</SelectItem>
                    <SelectItem value="swing">Swing Trading</SelectItem>
                    <SelectItem value="scalping">Scalping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="exchange">Exchange</Label>
                <Select value={newBotData.exchange} onValueChange={(value) => setNewBotData(prev => ({ ...prev, exchange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="coinbase">Coinbase</SelectItem>
                    <SelectItem value="kraken">Kraken</SelectItem>
                    <SelectItem value="kucoin">KuCoin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tradingPair">Trading Pair</Label>
                <Input
                  id="tradingPair"
                  value={newBotData.tradingPair}
                  onChange={(e) => setNewBotData(prev => ({ ...prev, tradingPair: e.target.value }))}
                  placeholder="BTC/USDT"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBot} disabled={!newBotData.name || !newBotData.strategy || !newBotData.exchange || !newBotData.tradingPair}>
                Create Bot
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bots.map((bot) => (
          <Card key={bot.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    <CuteRobotIcon className="size-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">{bot.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{bot.strategy}</p>
                  </div>
                </div>
                <Switch 
                  checked={bot.status === "running"} 
                  onCheckedChange={() => handleToggleBot(bot)}
                  disabled={bot.status === "error"}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">P&L</p>
                  <p className={`font-mono text-lg ${(bot.performance?.totalPnL || 0) >= 0 ? "text-success" : "text-destructive"}`}>
                    ${(bot.performance?.totalPnL || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bot.performance?.winRate ? `${(bot.performance.winRate * 100).toFixed(1)}% win rate` : 'No trades yet'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Volume</p>
                  <p className="font-mono text-lg">${(bot.performance?.totalVolume || 0).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total volume</p>
                </div>
              </div>

              {/* Bot Details */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pair:</span>
                  <span className="font-mono">{bot.tradingPair}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange:</span>
                  <span>{bot.exchange}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(bot.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2">
                <Badge
                  variant={bot.status === "running" ? "default" : bot.status === "stopped" ? "secondary" : "destructive"}
                >
                  {bot.status.toUpperCase()}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <GearIcon className="size-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteBot(bot.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bots.length === 0 && !loading && (
        <div className="text-center py-12">
          <CuteRobotIcon className="size-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No bots yet</h3>
          <p className="text-muted-foreground mb-4">Create your first trading bot to get started</p>
        </div>
      )}
    </DashboardPageLayout>
  )
}
