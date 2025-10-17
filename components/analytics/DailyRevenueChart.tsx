"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DailyTotalDTO } from "@/lib/actions/analytics";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface DailyRevenueChartProps {
  dailyData: DailyTotalDTO[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function DailyRevenueChart({ dailyData }: DailyRevenueChartProps) {
  console.log("[DailyRevenueChart] dailyData:", dailyData);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Map backend data to mockup format: { month, desktop, mobile }
  const chartData = (dailyData || []).map((item) => ({
    month: formatDate(item.date), // Use formatted date as 'month'
    desktop:
      typeof item.totalRevenue === "number"
        ? item.totalRevenue
        : Number(item.totalRevenue) || 0,
    mobile:
      typeof item.ordersCount === "number"
        ? item.ordersCount
        : Number(item.ordersCount) || 0,
  }));
  console.log("[DailyRevenueChart] chartData (mockup format):", chartData);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="col-span-full w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Daily Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No daily data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
