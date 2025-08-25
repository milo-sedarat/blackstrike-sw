"use client"

import { useState, useEffect } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import EmailIcon from "@/components/icons/email"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import Image from "next/image"

interface Pool {
  type: 'amm' | 'clmm';
  network: string;
  baseSymbol: string;
  quoteSymbol: string;
  address: string;
}

interface DeFiPosition {
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

export default function DeFiPositionsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeFiData();
  }, []);

  const fetchDeFiData = async () => {
    try {
      setLoading(true);
      
      // Fetch pools from different DEX protocols
      const [uniswapPools, jupiterPools, meteoraPools] = await Promise.all([
        fetch('/api/gateway/pools?connector=uniswap').then(res => res.json()).catch(() => []),
        fetch('/api/gateway/pools?connector=jupiter').then(res => res.json()).catch(() => []),
        fetch('/api/gateway/pools?connector=meteora').then(res => res.json()).catch(() => [])
      ]);

      // Combine all pools
      const allPools = [...uniswapPools, ...jupiterPools, ...meteoraPools];
      setPools(allPools);

      // Create mock DeFi positions from real pools (for demo)
      const mockPositions: DeFiPosition[] = allPools.slice(0, 5).map((pool, index) => ({
        id: `position-${index}`,
        protocol: pool.type === 'amm' ? 'Uniswap V2' : 'Uniswap V3',
        type: 'liquidity',
        network: pool.network,
        pool,
        value: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
        apy: Math.random() * 20 + 5,
        rewards: `$${(Math.random() * 100 + 10).toFixed(2)}`,
        status: 'active',
        risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      }));

      setDefiPositions(mockPositions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch DeFi data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const totalValue = defiPositions.reduce((sum, pos) => sum + parseFloat(pos.value.replace('$', '')), 0);
  const totalRewards = defiPositions.reduce((sum, pos) => sum + parseFloat(pos.rewards.replace('$', '')), 0);
  const activePositions = defiPositions.filter(pos => pos.status === 'active').length;

  const defiStats = [
    {
      label: "TOTAL VALUE",
      value: `$${totalValue.toFixed(2)}`,
      description: "ACROSS ALL POSITIONS",
      icon: EmailIcon,
    },
    {
      label: "YIELD EARNED",
      value: `$${totalRewards.toFixed(2)}`,
      description: "THIS MONTH",
      icon: GearIcon,
    },
    {
      label: "ACTIVE POSITIONS",
      value: activePositions.toString(),
      description: "DEFI PROTOCOLS",
      icon: ProcessorIcon,
    },
  ];

  if (loading) {
    return (
      <DashboardPageLayout
        header={{
          title: "DeFi Positions",
          description: "Manage your decentralized finance positions",
          icon: EmailIcon,
        }}
      >
        <div className="flex items-center justify-center h-64">
          <p>Loading DeFi data...</p>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      header={{
        title: "DeFi Positions",
        description: "Manage your decentralized finance positions",
        icon: EmailIcon,
      }}
    >
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {defiStats.map((stat, index) => (
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

      {/* Available Pools */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Available Pools</h2>
          <Button onClick={fetchDeFiData}>
            <ProcessorIcon className="mr-2 size-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pools.slice(0, 10).map((pool, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                      <ProcessorIcon className="size-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-display">
                        {pool.baseSymbol}/{pool.quoteSymbol}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{pool.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {pool.network}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Type</p>
                    <p className="font-mono text-lg">{pool.type.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Network</p>
                    <p className="font-mono text-lg">{pool.network}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Address:</span>
                    <span className="font-mono text-xs">{pool.address.slice(0, 8)}...{pool.address.slice(-6)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Add Liquidity
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* DeFi Positions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Active Positions</h2>
          <Button variant="outline">
            <ProcessorIcon className="mr-2 size-4" />
            Refresh All
          </Button>
        </div>

        {defiPositions.length === 0 ? (
          <div className="text-center py-12">
            <ProcessorIcon className="size-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No DeFi positions</h3>
            <p className="text-muted-foreground mb-4">Connect wallets and protocols to see your positions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {defiPositions.map((position) => (
              <Card key={position.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                        <ProcessorIcon className="size-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display">{position.protocol}</CardTitle>
                        <p className="text-sm text-muted-foreground">{position.type}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {position.network}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Position Value and APY */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Position Value</p>
                      <p className="font-mono text-lg">{position.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">APY</p>
                      <p className="font-mono text-lg text-success">{position.apy.toFixed(2)}%</p>
                    </div>
                  </div>

                  {/* Position Details */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pair:</span>
                      <span className="font-mono">{position.pool.baseSymbol}/{position.pool.quoteSymbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rewards:</span>
                      <span className="font-mono text-success">{position.rewards}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <Badge
                        variant={
                          position.risk === "low" ? "default" : position.risk === "medium" ? "secondary" : "destructive"
                        }
                        className="text-xs"
                      >
                        {position.risk.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Harvest
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
