"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function DashboardChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-500/10">
            <TrendingUp className="size-4 text-blue-400" />
          </div>
          <span>Portfolio Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="size-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">No portfolio data</p>
          <p className="text-sm">Connect exchanges and create bots to see your portfolio performance</p>
        </div>
      </CardContent>
    </Card>
  );
}
