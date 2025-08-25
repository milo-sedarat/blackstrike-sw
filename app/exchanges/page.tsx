import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import ProcessorIcon from "@/components/icons/proccesor"
import GearIcon from "@/components/icons/gear"
import Image from "next/image"

// Section 1: CENTRALIZED EXCHANGES (CLOB CEX)
const centralizedExchanges = [
  {
    name: "Binance",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg",
    description: "World's largest cryptocurrency exchange by trading volume",
    features: ["Spot", "Futures", "Margin", "Options"],
    isPartner: true,
    connectionType: "API Keys"
  },
  {
    name: "Coinbase Advanced",
    logo: "https://cryptologos.cc/logos/coinbase-coin-logo.svg", 
    description: "Leading US-based exchange with institutional features",
    features: ["Spot", "Advanced Trading", "Pro"],
    isPartner: true,
    connectionType: "API Keys"
  },
  {
    name: "Kraken",
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    description: "Secure and reliable exchange with advanced trading",
    features: ["Spot", "Futures", "Margin", "Staking"],
    isPartner: false,
    connectionType: "API Keys"
  },
  {
    name: "KuCoin",
    logo: "https://cryptologos.cc/logos/kucoin-shares-kcs-logo.svg",
    description: "Global crypto exchange serving millions worldwide",
    features: ["Spot", "Futures", "Margin", "P2P"],
    isPartner: true,
    connectionType: "API Keys"
  },
  {
    name: "OKX",
    logo: "https://seeklogo.com/images/O/okx-logo-D3C7B6B531-seeklogo.com.png",
    description: "Top global crypto exchange and Web3 ecosystem",
    features: ["Spot", "Futures", "Options", "Web3"],
    isPartner: true,
    connectionType: "API Keys"
  },
  {
    name: "Bybit",
    logo: "https://seeklogo.com/images/B/bybit-logo-C0CDABA41B-seeklogo.com.png",
    description: "High-performance derivatives and spot trading",
    features: ["Derivatives", "Spot", "Copy Trading"],
    isPartner: false,
    connectionType: "API Keys"
  },
  {
    name: "Bitfinex", 
    logo: "https://seeklogo.com/images/B/bitfinex-logo-4C8AC6EC4B-seeklogo.com.png",
    description: "Advanced trading platform with deep liquidity",
    features: ["Spot", "Margin", "Derivatives"],
    isPartner: false,
    connectionType: "API Keys"
  },
  {
    name: "Huobi (HTX)",
    logo: "https://cryptologos.cc/logos/huobi-token-ht-logo.svg",
    description: "Leading global digital asset exchange",
    features: ["Spot", "Futures", "Margin"],
    isPartner: false,
    connectionType: "API Keys"
  },
  {
    name: "Gate.io",
    logo: "https://seeklogo.com/images/G/gate-io-logo-6F3F98F4B6-seeklogo.com.png", 
    description: "Comprehensive crypto trading platform",
    features: ["Spot", "Futures", "Margin", "Copy Trading"],
    isPartner: false,
    connectionType: "API Keys"
  },
  {
    name: "MEXC",
    logo: "https://seeklogo.com/images/M/mexc-logo-7A5F672BF7-seeklogo.com.png",
    description: "Global cryptocurrency exchange with low fees",
    features: ["Spot", "Futures", "Margin"],
    isPartner: false,
    connectionType: "API Keys"
  }
];

// Section 2: DECENTRALIZED EXCHANGES (AMM DEX)
const ammExchanges = [
  {
    name: "Uniswap",
    logo: "https://cryptologos.cc/logos/uniswap-uni-logo.svg",
    description: "Leading decentralized exchange on Ethereum",
    features: ["Spot", "Liquidity Pools", "Yield Farming"],
    blockchain: "Ethereum",
    connectionType: "Gateway"
  },
  {
    name: "PancakeSwap",
    logo: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
    description: "Most popular DEX on BNB Smart Chain", 
    features: ["Spot", "Farms", "Pools", "NFT"],
    blockchain: "BNB Chain",
    connectionType: "Gateway"
  },
  {
    name: "SushiSwap",
    logo: "https://cryptologos.cc/logos/sushiswap-sushi-logo.svg",
    description: "Multi-chain AMM with advanced features",
    features: ["Spot", "Yield Farming", "Lending"],
    blockchain: "Multi-chain",
    connectionType: "Gateway"
  },
  {
    name: "Balancer",
    logo: "https://cryptologos.cc/logos/balancer-bal-logo.svg", 
    description: "Automated portfolio manager and liquidity provider",
    features: ["Weighted Pools", "Stable Pools", "Boosted Pools"],
    blockchain: "Ethereum",
    isPartner: true,
    connectionType: "Gateway"
  },
  {
    name: "Curve Finance",
    logo: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg",
    description: "Specialized stablecoin exchange with deep liquidity", 
    features: ["Stable Swaps", "Liquidity Pools", "Yield"],
    blockchain: "Multi-chain",
    connectionType: "Gateway"
  },
  {
    name: "Raydium",
    logo: "https://cryptologos.cc/logos/raydium-ray-logo.svg",
    description: "Leading automated market maker on Solana",
    features: ["Spot", "Yield Farming", "Liquidity"],
    blockchain: "Solana", 
    connectionType: "Gateway"
  }
];

// Section 3: CLOB DEXs (On-chain Order Books)
const clobDexExchanges = [
  {
    name: "dYdX",
    logo: "https://cryptologos.cc/logos/dydx-dydx-logo.svg",
    description: "Leading decentralized derivatives exchange",
    features: ["Perpetuals", "Margin", "Spot"],
    blockchain: "StarkEx", 
    connectionType: "Wallet"
  },
  {
    name: "Hyperliquid", 
    logo: "https://pbs.twimg.com/profile_images/1735069742096654336/4RoZjNWI_400x400.jpg",
    description: "High-performance onchain perpetuals exchange",
    features: ["Perpetuals", "Spot", "Vaults"],
    blockchain: "Hyperliquid L1",
    isPartner: true,
    connectionType: "Wallet"
  },
  {
    name: "XRP Ledger DEX",
    logo: "https://cryptologos.cc/logos/xrp-xrp-logo.svg",
    description: "Built-in decentralized exchange on XRP Ledger", 
    features: ["CLOB", "AMM", "Cross-currency"],
    blockchain: "XRP Ledger",
    connectionType: "Wallet"
  },
  {
    name: "Loopring",
    logo: "https://cryptologos.cc/logos/loopring-lrc-logo.svg",
    description: "Ethereum zkRollup exchange protocol",
    features: ["Spot", "AMM", "Order Books"], 
    blockchain: "Ethereum L2",
    connectionType: "Gateway"
  }
];

// Section 4: DEX AGGREGATORS
const aggregatorExchanges = [
  {
    name: "1inch",
    logo: "https://cryptologos.cc/logos/1inch-1inch-logo.svg",
    description: "Leading DEX aggregator with optimal routing", 
    features: ["Spot", "Limit Orders", "Fusion"],
    blockchain: "Multi-chain",
    connectionType: "Gateway"
  },
  {
    name: "Jupiter",
    logo: "https://pbs.twimg.com/profile_images/1735719117269393408/k5P82heF_400x400.jpg", 
    description: "Key liquidity aggregator for Solana ecosystem",
    features: ["Spot", "Limit Orders", "DCA"],
    blockchain: "Solana",
    connectionType: "Gateway"
  },
  {
    name: "Derive",
    logo: "https://pbs.twimg.com/profile_images/1578120304649801730/GbNOZ-j3_400x400.jpg",
    description: "Decentralized exchange aggregator for best prices",
    features: ["Aggregation", "Cross-chain", "Best Prices"],
    blockchain: "Multi-chain", 
    connectionType: "Gateway"
  }
];

const exchangeStats = [
  {
    label: "SUPPORTED",
    value: "23",
    description: "EXCHANGES",
    icon: ProcessorIcon,
  },
  {
    label: "PARTNERS",
    value: "7",
    description: "VERIFIED PARTNERS",
    icon: GearIcon,
  },
  {
    label: "BLOCKCHAINS",
    value: "8+",
    description: "SUPPORTED NETWORKS",
    icon: ProcessorIcon,
  },
]

export default function ExchangesPage() {
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
                  {exchange.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full">Connect Exchange</Button>
              </CardContent>
            </Card>
          ))}
        </div>
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

                <Button className="w-full">Connect DEX</Button>
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

                <Button className="w-full">Connect DEX</Button>
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

                <Button className="w-full">Connect Aggregator</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardPageLayout>
  )
}
