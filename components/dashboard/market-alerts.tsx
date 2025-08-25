import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MarketAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-orange-500/10">
            <Bell className="size-4 text-orange-400" />
          </div>
          <span>Market Alerts</span>
          <Badge variant="outline" className="text-xs">
            0 Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="size-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No market alerts</p>
          <p className="text-sm">Set up alerts to monitor price movements and market conditions</p>
        </div>
      </CardContent>
    </Card>
  )
}
