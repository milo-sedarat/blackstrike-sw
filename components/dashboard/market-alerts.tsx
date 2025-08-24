import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MarketAlert {
  title: string
  value: string
  status: string
  variant: "success" | "warning" | "destructive"
}

interface MarketAlertsProps {
  alerts: MarketAlert[]
}

export default function MarketAlerts({ alerts }: MarketAlertsProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-display">MARKET ALERTS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <div className="font-display text-sm">{alert.title}</div>
              <div className="font-mono text-lg">{alert.value}</div>
            </div>
            <div
              className={cn(
                "text-xs font-mono px-2 py-1 rounded",
                alert.variant === "success" && "text-success bg-success/10",
                alert.variant === "warning" && "text-warning bg-warning/10",
                alert.variant === "destructive" && "text-destructive bg-destructive/10",
              )}
            >
              {alert.status}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
