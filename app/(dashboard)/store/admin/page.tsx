import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBasket, User, Users } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import RecentSalesChart from "@/components/admin/RecentSalesChart";
import { DataTableDemo } from "@/components/common/DataTable";

export default function StoreAdminPage() {
  const cards = [
    {
      title: "Total Sales",
      value: "R12,345",
      change: "50",
      icon: DollarSign,
    },
    {
      title: "Total Branches",
      value: "5",
      change: "-10",
      icon: Package,
    },
    {
      title: "Total Products",
      value: "150",
      change: "20",
      icon: ShoppingBasket,
    },
    {
      title: "Total Employees",
      value: "50",
      change: "5",
      icon: Users,
    },
  ];
  const recentSales = [
    {
      id: 1,
      branchName: "Main Store",
      date: "Today",
      totalSales: "R5,000",
    },
    {
      id: 2,
      branchName: "Downtown Branch",
      date: "Today",
      totalSales: "R3,000",
    },
    {
      id: 3,
      branchName: "Uptown Branch",
      date: "Today",
      totalSales: "R2,000",
    },
    {
      id: 4,
      branchName: "Suburb Branch",
      date: "Yesterday",
      totalSales: "R4,500",
    },
    {
      id: 5,
      branchName: "City Center Branch",
      date: "Yesterday",
      totalSales: "R3,500",
    },
  ];
  const salesTrend = [
    { month: "Jan", desktop: 4000, mobile: 2400 },
    { month: "Feb", desktop: 3000, mobile: 1398 },
    { month: "Mar", desktop: 2000, mobile: 9800 },
    { month: "Apr", desktop: 2780, mobile: 3908 },
    { month: "May", desktop: 1890, mobile: 4800 },
    { month: "Jun", desktop: 2390, mobile: 3800 },
    { month: "Jul", desktop: 3490, mobile: 4300 },
  ];

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
    <div>
      <h1 className="text-2xl font-bold mb-2">Store Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              <div className="text-lg font-semibold flex items-center justify-between">
                <div className="">
                  <p>{card.title}</p>
                  <h2 className="text-lg text-slate-700 font-bold">
                    {card.value}
                  </h2>
                  <p
                    className={`text-green-600 ${
                      card.change.startsWith("-")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {card.change}
                  </p>
                </div>
                <span className="rounded-full bg-green-100 p-3">
                  <card.icon className="h-6 w-6 text-green-600" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="col-span-1 md:col-span-2">
          <CardContent>
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <div className="mt-4 space-y-2">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between border-b pb-2 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">{sale.branchName}</p>
                    <p className="text-xs text-gray-400">{sale.date}</p>
                  </div>
                  <p className="font-semibold">{sale.totalSales}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <RecentSalesChart salesTrend={salesTrend} chartConfig={chartConfig} />
        <div className="w-full col-span-4">
          <DataTableDemo />
        </div>
      </div>
    </div>
  );
}
