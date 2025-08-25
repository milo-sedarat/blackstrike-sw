'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import DashboardPageLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Widget from "@/components/dashboard/widget";
import TradingBots from "@/components/dashboard/trading-bots";
import MarketAlerts from "@/components/dashboard/market-alerts";
import SecurityStatus from "@/components/dashboard/security-status";
import RebelsRanking from "@/components/dashboard/rebels-ranking";
import Notifications from "@/components/dashboard/notifications";
import AIChatbot from "@/components/dashboard/ai-chatbot";
import Stat from "@/components/dashboard/stat";
import Chart from "@/components/dashboard/chart";
import LightningIcon from "@/components/icons/lightning";
import AtomIcon from "@/components/icons/atom";
import BellIcon from "@/components/icons/bell";
import GearIcon from "@/components/icons/gear";
import LockIcon from "@/components/icons/lock";
import BoomIcon from "@/components/icons/boom";

// Dashboard data
const widgetData = {
  timezone: "UTC",
  temperature: "72°F",
  weather: "Sunny",
  location: "New York, NY",
  date: new Date().toISOString()
};

const tradingBots = [
  {
    id: 1,
    name: "BTC Grid Bot",
    strategy: "Grid Trading",
    pnl: "+$1,247.50",
    status: "active" as const,
    avatar: "/bitcoin-concept.png",
    performance: "+12.4%"
  },
  {
    id: 2,
    name: "ETH DCA Bot",
    strategy: "Dollar Cost Average",
    pnl: "+$892.30",
    status: "active" as const,
    avatar: "/ethereum-abstract.png",
    performance: "+8.9%"
  },
  {
    id: 3,
    name: "SOL Momentum",
    strategy: "Momentum Trading",
    pnl: "+$634.80",
    status: "paused" as const,
    avatar: "/solana-blockchain.png",
    performance: "+15.2%"
  }
];

const marketAlerts = [
  {
    title: "BTC/USDT",
    value: "$45,000",
    status: "HIGH",
    variant: "success" as const
  },
  {
    title: "ETH Volume",
    value: "2.4M",
    status: "SPIKE",
    variant: "warning" as const
  },
  {
    title: "SOL Price",
    value: "$98.50",
    status: "DOWN",
    variant: "destructive" as const
  }
];

const securityStatuses = [
  {
    title: "API Keys",
    value: "SECURE",
    status: "2 min ago",
    variant: "success" as const
  },
  {
    title: "2FA",
    value: "ENABLED",
    status: "1 hour ago",
    variant: "success" as const
  },
  {
    title: "IP Whitelist",
    value: "ACTIVE",
    status: "30 min ago",
    variant: "success" as const
  }
];

const rebelsRanking = [
  {
    id: 1,
    name: "CryptoKing",
    handle: "@cryptoking",
    streak: "7 days",
    points: 12450,
    avatar: "/avatars/user_joyboy.png"
  },
  {
    id: 2,
    name: "DeFiQueen",
    handle: "@defiqueen",
    streak: "5 days",
    points: 11890,
    avatar: "/avatars/user_krimson.png"
  },
  {
    id: 3,
    name: "BlockchainBaron",
    handle: "@blockchainbaron",
    streak: "3 days",
    points: 11230,
    avatar: "/avatars/user_mati.png"
  }
];

const initialNotifications = [
  {
    id: "1",
    title: "Bot Started",
    message: "BTC Grid Bot has started successfully",
    timestamp: "2 min ago",
    type: "success" as const,
    read: false,
    priority: "high" as const
  },
  {
    id: "2",
    title: "High Volatility",
    message: "ETH price showing unusual volatility",
    timestamp: "5 min ago",
    type: "warning" as const,
    read: false,
    priority: "medium" as const
  },
  {
    id: "3",
    title: "New Feature",
    message: "Advanced charting tools now available",
    timestamp: "1 hour ago",
    type: "info" as const,
    read: true,
    priority: "low" as const
  }
];

const stats = [
  {
    label: "Total Portfolio",
    value: "$124,750.50",
    change: "+$2,847.30",
    changePercent: "+2.34%",
    icon: LightningIcon,
    trend: "up"
  },
  {
    label: "Active Bots",
    value: "6",
    change: "+2",
    changePercent: "+50%",
    icon: AtomIcon,
    trend: "up"
  },
  {
    label: "24h Volume",
    value: "$847,230",
    change: "+$12,450",
    changePercent: "+1.49%",
    icon: BoomIcon,
    trend: "up"
  },
  {
    label: "Win Rate",
    value: "68.4%",
    change: "+2.1%",
    changePercent: "+3.17%",
    icon: BellIcon,
    trend: "up"
  }
];

function Dashboard() {
  return (
    <DashboardPageLayout
      header={{
        title: "Dashboard",
        description: "Your crypto trading command center",
        icon: LightningIcon,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Stat key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trading Bots */}
          <TradingBots bots={tradingBots} />
          
          {/* Market Alerts */}
          <MarketAlerts alerts={marketAlerts} />
          
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GearIcon className="size-5" />
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Widget */}
          <Widget widgetData={widgetData} />
          
          {/* Security Status */}
          <SecurityStatus statuses={securityStatuses} />
          
          {/* Rebels Ranking */}
          <RebelsRanking rebels={rebelsRanking} />
          
          {/* Notifications */}
          <Notifications initialNotifications={initialNotifications} />
        </div>
      </div>

      {/* AI Chatbot - Fixed Position */}
      <AIChatbot />
    </DashboardPageLayout>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* BlackStrike Logo - Top Left */}
        <div className="absolute top-8 left-8 z-10">
          <Image
            src="/assets/blackstrike-logo.png"
            alt="BlackStrike"
            width={200}
            height={80}
            className="h-12 w-auto"
          />
        </div>

        {/* Loading Content - Centered */}
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <div className="text-center space-y-8">
            <div className="flex flex-col items-center justify-center gap-10">
              <picture className="w-1/4 aspect-square grayscale opacity-50">
                <Image
                  src="/assets/bot_greenprint.gif"
                  alt="Security Status"
                  width={1000}
                  height={1000}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="size-full object-contain"
                />
              </picture>

              <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-xl font-bold uppercase text-muted-foreground">
                  Loading
                </h1>
                <p className="text-sm max-w-sm text-center text-muted-foreground text-balance">
                  Initializing BlackStrike...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return null; // Will redirect to login
  }

  // Show dashboard content for authenticated users
  return <Dashboard />;
}
