"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import ProcessorIcon from "@/components/icons/proccesor"
import GearIcon from "@/components/icons/gear"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Empty exchanges - will be populated from real data
const centralizedExchanges: any[] = [];

// Empty exchanges - will be populated from real data
const ammExchanges: any[] = [];

// Empty exchanges - will be populated from real data
const clobDexExchanges: any[] = [];

// Empty exchanges - will be populated from real data
const aggregatorExchanges: any[] = [];

const exchangeStats = [
  {
    label: "SUPPORTED",
    value: "0",
    description: "EXCHANGES",
    icon: ProcessorIcon,
  },
  {
    label: "PARTNERS",
    value: "0",
    description: "VERIFIED PARTNERS",
    icon: GearIcon,
  },
  {
    label: "BLOCKCHAINS",
    value: "0",
    description: "SUPPORTED NETWORKS",
    icon: ProcessorIcon,
  },
]

// Connection Dialog Component
function ConnectionDialog({ 
  exchange, 
  isOpen, 
  onClose, 
  onConnect 
}: { 
  exchange: any; 
  isOpen: boolean; 
  onClose: () => void; 
  onConnect: (data: any) => void; 
}) {
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    sandbox: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect({ ...formData, name: exchange.name });
    setFormData({ apiKey: '', apiSecret: '', passphrase: '', sandbox: false });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to {exchange.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              value={formData.apiSecret}
              onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
              required
            />
          </div>
          {exchange.name === 'Coinbase Advanced' && (
            <div>
              <Label htmlFor="passphrase">Passphrase</Label>
              <Input
                id="passphrase"
                type="text"
                value={formData.passphrase}
                onChange={(e) => setFormData(prev => ({ ...prev, passphrase: e.target.value }))}
                required
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="sandbox"
              checked={formData.sandbox}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sandbox: checked }))}
            />
            <Label htmlFor="sandbox">Use Sandbox/Testnet</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Connect Exchange
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ExchangesPage() {
  const { user } = useAuth();
  const [connectionDialog, setConnectionDialog] = useState<{
    isOpen: boolean;
    exchange: any;
  }>({ isOpen: false, exchange: null });

  const handleConnectExchange = (exchange: any) => {
    setConnectionDialog({ isOpen: true, exchange });
  };

  const handleConnect = async (connectionData: any) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/hummingbot/exchanges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        throw new Error('Failed to connect exchange');
      }

      // Show success message or update UI
      console.log('Exchange connected successfully');
    } catch (error) {
      console.error('Error connecting exchange:', error);
      // Show error message
    }
  };
  return (
    <DashboardPageLayout
      header={{
        title: "Exchanges",
        description: "Connect to 23+ supported exchanges and DEXs",
        icon: ProcessorIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {exchangeStats.map((stat, index) => (
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

      {/* Section 1: Centralized Exchanges */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display">Centralized Exchanges (CEX)</h2>
            <p className="text-sm text-muted-foreground">Traditional order book exchanges with API access</p>
          </div>
        </div>

        {centralizedExchanges.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="size-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <GearIcon className="size-8" />
            </div>
            <p className="text-lg font-medium mb-2">No centralized exchanges</p>
            <p className="text-sm">Connect your first exchange to start trading</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centralizedExchanges.map((exchange, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                      <Image
                        src={exchange.logo}
                        alt={exchange.name}
                        width={32}
                        height={32}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg">{exchange.name}</h3>
                        {exchange.isPartner && (
                          <Badge variant="default" className="text-xs">Partner</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {exchange.connectionType}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{exchange.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {exchange.features.map((feature: string) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleConnectExchange(exchange)}
                  >
                    Connect Exchange
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: AMM DEXs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display">Decentralized Exchanges (AMM DEX)</h2>
            <p className="text-sm text-muted-foreground">Automated market makers with liquidity pools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ammExchanges.map((exchange, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                    <Image
                      src={exchange.logo}
                      alt={exchange.name}
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg">{exchange.name}</h3>
                      {exchange.isPartner && (
                        <Badge variant="default" className="text-xs">Partner</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {exchange.connectionType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {exchange.blockchain}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{exchange.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exchange.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleConnectExchange(exchange)}
                >
                  Connect DEX
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: CLOB DEXs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display">CLOB DEXs (On-chain Order Books)</h2>
            <p className="text-sm text-muted-foreground">Decentralized exchanges with traditional order books</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clobDexExchanges.map((exchange, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                    <Image
                      src={exchange.logo}
                      alt={exchange.name}
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg">{exchange.name}</h3>
                      {exchange.isPartner && (
                        <Badge variant="default" className="text-xs">Partner</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {exchange.connectionType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {exchange.blockchain}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{exchange.description}</p>

                                  <div className="flex flex-wrap gap-2 mb-4">
                    {exchange.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleConnectExchange(exchange)}
                  >
                    Connect DEX
                  </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 4: DEX Aggregators */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display">DEX Aggregators</h2>
            <p className="text-sm text-muted-foreground">Find the best prices across multiple DEXs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aggregatorExchanges.map((exchange, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full overflow-hidden bg-background p-2">
                    <Image
                      src={exchange.logo}
                      alt={exchange.name}
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg">{exchange.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {exchange.connectionType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {exchange.blockchain}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{exchange.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exchange.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleConnectExchange(exchange)}
                >
                  Connect Aggregator
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Connection Dialog */}
      {connectionDialog.exchange && (
        <ConnectionDialog
          exchange={connectionDialog.exchange}
          isOpen={connectionDialog.isOpen}
          onClose={() => setConnectionDialog({ isOpen: false, exchange: null })}
          onConnect={handleConnect}
        />
      )}
    </DashboardPageLayout>
  )
}
