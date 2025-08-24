import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface TradingBot {
  id: number
  name: string
  strategy: string
  pnl: string
  status: "active" | "paused"
  avatar: string
  performance: string
}

interface TradingBotsProps {
  bots: TradingBot[]
}

export default function TradingBots({ bots }: TradingBotsProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-display">ACTIVE BOTS</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {bots.map((bot) => (
          <div key={bot.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden bg-primary/10">
                <Image
                  src={bot.avatar || "/placeholder.svg"}
                  alt={bot.name}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <div className="font-display text-sm">{bot.name}</div>
                <div className="text-xs text-muted-foreground uppercase">{bot.strategy}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm text-success">{bot.pnl}</div>
              <div className="flex items-center gap-2">
                <Badge variant={bot.status === "active" ? "default" : "secondary"} className="text-xs">
                  {bot.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{bot.performance}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
