"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

interface ProductData {
  category: string;
  sales: number;
  percentage: number;
}

export function SalesChart({
  salesData,
  chartConfig,
}: {
  salesData: SalesData[];
  chartConfig: ChartConfig;
}) {
  // Calculate percentage change
  const firstMonth = salesData[0]?.sales || 0;
  const lastMonth = salesData[salesData.length - 1]?.sales || 0;
  const percentChange = (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(
    1
  );
  const isPositive = parseFloat(percentChange) >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
        <CardDescription>
          Showing sales and orders for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={salesData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="orders"
              type="natural"
              fill="url(#fillOrders)"
              fillOpacity={0.4}
              stroke="#3b82f6"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              fillOpacity={0.4}
              stroke="#06b6d4"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {isPositive ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(parseFloat(percentChange))}% this period
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {salesData[0]?.month} - {salesData[salesData.length - 1]?.month}{" "}
              2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function ProductChart({
  productData,
  chartConfig,
}: {
  productData: ProductData[];
  chartConfig: ChartConfig;
}) {
  // Calculate total sales
  const totalSales = productData.reduce((sum, item) => sum + item.sales, 0);

  // Find top performing category
  const topCategory = productData.reduce(
    (max, item) => (item.sales > max.sales ? item : max),
    productData[0]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>
          {productData[0]?.category} -{" "}
          {productData[productData.length - 1]?.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={productData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 10 ? value.slice(0, 10) + "..." : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="sales" fill="#10b981" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {topCategory?.category} leading with {topCategory?.percentage}% of
          total sales
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total revenue: R{totalSales.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
