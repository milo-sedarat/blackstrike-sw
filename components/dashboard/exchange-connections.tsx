"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { type ExchangeConnection } from "@/lib/trading-engine"
import { Link, Unlink, Plus, Settings, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExchangeConnections() {
  const { user } = useAuth()
  const [connections, setConnections] = useState<ExchangeConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'cex' as 'cex' | 'dex',
    apiKey: '',
    apiSecret: '',
    passphrase: ''
  })

  useEffect(() => {
    if (user) {
      loadConnections()
    }
  }, [user])

  const loadConnections = async () => {
    if (!user) return
    
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/trading/exchanges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const connectionsData = await response.json()
        setConnections(connectionsData)
      }
    } catch (error) {
      console.error('Error loading connections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!user) return
    
    setIsConnecting(true)
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/trading/exchanges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const newConnection = await response.json()
        setConnections(prev => [...prev, newConnection])
        setIsDialogOpen(false)
        setFormData({
          name: '',
          type: 'cex',
          apiKey: '',
          apiSecret: '',
          passphrase: ''
        })
        alert(`Successfully connected to ${newConnection.name}!`)
      } else {
        const errorData = await response.json()
        alert(`Error connecting: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error connecting exchange:', error)
      alert('Error connecting exchange')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (connectionId: string) => {
    if (!user) return
    
    if (!confirm('Are you sure you want to disconnect this exchange?')) return
    
    try {
      const token = await user.getIdToken()
      const response = await fetch(`/api/trading/exchanges/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setConnections(prev => prev.filter(conn => conn.id !== connectionId))
        alert('Exchange disconnected successfully!')
      } else {
        const errorData = await response.json()
        alert(`Error disconnecting: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error disconnecting exchange:', error)
      alert('Error disconnecting exchange')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'disconnected':
        return 'bg-gray-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cex':
        return 'bg-blue-500'
      case 'dex':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-green-500/10">
              <Link className="size-4 text-green-400" />
            </div>
            <span>Exchange Connections</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-green-500/10">
              <Link className="size-4 text-green-400" />
            </div>
            <span>Exchange Connections</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="size-3" />
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Exchange</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exchange-name">Exchange Name</Label>
                  <Input
                    id="exchange-name"
                    placeholder="e.g., Binance, Coinbase"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="exchange-type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'cex' | 'dex') => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cex">Centralized Exchange (CEX)</SelectItem>
                      <SelectItem value="dex">Decentralized Exchange (DEX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="Enter your API secret"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
                  />
                </div>
                
                {formData.type === 'cex' && (
                  <div>
                    <Label htmlFor="passphrase">Passphrase (Optional)</Label>
                    <Input
                      id="passphrase"
                      type="password"
                      placeholder="Enter passphrase if required"
                      value={formData.passphrase}
                      onChange={(e) => setFormData(prev => ({ ...prev, passphrase: e.target.value }))}
                    />
                  </div>
                )}
                
                <Button 
                  onClick={handleConnect}
                  disabled={isConnecting || !formData.name || !formData.apiKey || !formData.apiSecret}
                  className="w-full"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link className="size-4" />
                      Connect Exchange
                    </div>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {connections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Link className="size-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No exchange connections</p>
            <p className="text-sm">Connect your first exchange to start trading</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map((connection) => (
              <div key={connection.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{connection.name}</h4>
                      <div className={cn("w-2 h-2 rounded-full", getStatusColor(connection.status))} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {connection.type.toUpperCase()}
                      </Badge>
                      <span>•</span>
                      <span>Balance: ${connection.balance.toLocaleString()}</span>
                      <span>•</span>
                      <span>Last sync: {new Date(connection.lastSync).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline">
                      <Settings className="size-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDisconnect(connection.id)}
                    >
                      <Unlink className="size-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="size-3" />
                    <span className="text-muted-foreground">Status:</span>
                    <Badge 
                      variant={connection.status === 'connected' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {connection.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    ID: {connection.id.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 