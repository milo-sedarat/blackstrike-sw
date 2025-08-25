"use client";

import * as React from "react";
import { XAxis, YAxis, CartesianGrid, Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Empty chart data
const emptyChartData = [
  { date: 'Mon', value: 0 },
  { date: 'Tue', value: 0 },
  { date: 'Wed', value: 0 },
  { date: 'Thu', value: 0 },
  { date: 'Fri', value: 0 },
  { date: 'Sat', value: 0 },
  { date: 'Sun', value: 0 },
];

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
        <div className="bg-accent rounded-lg p-3 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={emptyChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF" 
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                domain={[0, 100]}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4 text-muted-foreground">
          <p className="text-sm">No portfolio data available</p>
          <p className="text-xs">Connect exchanges to see your performance</p>
        </div>
      </CardContent>
    </Card>
  );
}
