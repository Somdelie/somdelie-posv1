import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  ShoppingCart,
  BarChart3,
  Calendar,
  Eye,
  Activity,
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { getStoreById } from "@/lib/actions/store";
import { redirect } from "next/navigation";
import { ChartConfig } from "@/components/ui/chart";
import { SalesChart, ProductChart } from "@/components/charts/AnalyticsCharts";

export default async function StoreAnalyticsPage() {
  // Get current user to extract storeId
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    redirect("/create-store");
  }

  // Fetch store data from backend
  const store = await getStoreById(user.storeId);

  if (!store) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load store information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample analytics data (replace with real API calls later)
  const salesData = [
    { month: "Jan", sales: 65000, orders: 120 },
    { month: "Feb", sales: 72000, orders: 135 },
    { month: "Mar", sales: 68000, orders: 128 },
    { month: "Apr", sales: 81000, orders: 156 },
    { month: "May", sales: 75000, orders: 142 },
    { month: "Jun", sales: 88000, orders: 168 },
  ];

  const productData = [
    { category: "Electronics", sales: 35000, percentage: 40 },
    { category: "Clothing", sales: 26250, percentage: 30 },
    { category: "Home & Garden", sales: 17500, percentage: 20 },
    { category: "Sports", sales: 8750, percentage: 10 },
  ];

  const recentActivity = [
    { action: "New product added", time: "2 hours ago", type: "product" },
    { action: "Order #1234 completed", time: "4 hours ago", type: "order" },
    { action: "New cashier registered", time: "1 day ago", type: "user" },
    { action: "Branch opened", time: "2 days ago", type: "branch" },
  ];

  const metrics = [
    {
      title: "Total Revenue",
      value: "R1,234,567",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Orders",
      value: "2,456",
      change: "+8.2%",
      changeType: "positive",
      icon: ShoppingCart,
      description: "total orders",
    },
    {
      title: "Active Products",
      value: "1,234",
      change: "+23",
      changeType: "positive",
      icon: Package,
      description: "in inventory",
    },
    {
      title: "Branches",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: Building2,
      description: "locations",
    },
    {
      title: "Employees",
      value: "45",
      change: "+5",
      changeType: "positive",
      icon: Users,
      description: "active staff",
    },
    {
      title: "Daily Visitors",
      value: "1,847",
      change: "-3.2%",
      changeType: "negative",
      icon: Eye,
      description: "today",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#06b6d4",
    },
    orders: {
      label: "Orders",
      color: "#3b82f6",
    },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Store Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {store.brandName} Analytics
            </h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mt-2">
              <p className="text-muted-foreground">
                Store Performance Overview
              </p>
              <Badge className={getStatusColor(store.status)}>
                {store.status}
              </Badge>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric, index) => {
            // Color schemes for each metric with dark mode support
            const colorSchemes = [
              {
                gradient: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-50 dark:bg-emerald-950/50",
                icon: "text-emerald-600 dark:text-emerald-400",
                ring: "ring-emerald-100 dark:ring-emerald-900/50",
              },
              {
                gradient: "from-blue-500 to-cyan-600",
                bg: "bg-blue-50 dark:bg-blue-950/50",
                icon: "text-blue-600 dark:text-blue-400",
                ring: "ring-blue-100 dark:ring-blue-900/50",
              },
              {
                gradient: "from-purple-500 to-pink-600",
                bg: "bg-purple-50 dark:bg-purple-950/50",
                icon: "text-purple-600 dark:text-purple-400",
                ring: "ring-purple-100 dark:ring-purple-900/50",
              },
              {
                gradient: "from-orange-500 to-red-600",
                bg: "bg-orange-50 dark:bg-orange-950/50",
                icon: "text-orange-600 dark:text-orange-400",
                ring: "ring-orange-100 dark:ring-orange-900/50",
              },
              {
                gradient: "from-indigo-500 to-purple-600",
                bg: "bg-indigo-50 dark:bg-indigo-950/50",
                icon: "text-indigo-600 dark:text-indigo-400",
                ring: "ring-indigo-100 dark:ring-indigo-900/50",
              },
              {
                gradient: "from-rose-500 to-pink-600",
                bg: "bg-rose-50 dark:bg-rose-950/50",
                icon: "text-rose-600 dark:text-rose-400",
                ring: "ring-rose-100 dark:ring-rose-900/50",
              },
            ];

            const colors = colorSchemes[index];

            return (
              <Card
                key={index}
                className="relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card"
              >
                {/* Decorative gradient background - adjusted opacity for dark mode */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-10 dark:opacity-20 rounded-full -mr-16 -mt-16`}
                ></div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div
                    className={`${colors.bg} p-3 rounded-xl ring-4 ${colors.ring} transition-colors`}
                  >
                    <metric.icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold tracking-tight">
                    {metric.value}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {metric.changeType === "positive" ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            {metric.change}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 dark:bg-rose-950/50 rounded-full border border-rose-200 dark:border-rose-800">
                          <TrendingDown className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                          <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                            {metric.change}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {metric.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
          {/* Sales Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Trend (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart salesData={salesData} chartConfig={chartConfig} />
            </CardContent>
          </Card>

          {/* Product Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductChart
                productData={productData}
                chartConfig={chartConfig}
              />
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start sm:items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg border"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 sm:mt-0 flex-shrink-0 ${
                        activity.type === "product"
                          ? "bg-blue-500"
                          : activity.type === "order"
                          ? "bg-green-500"
                          : activity.type === "user"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg. Order Value
                  </span>
                  <span className="font-medium">R847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Conversion Rate
                  </span>
                  <span className="font-medium">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Return Rate
                  </span>
                  <span className="font-medium">1.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Customer Satisfaction
                  </span>
                  <span className="font-medium">4.6/5</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Store Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Store Type:</span>
                    <span>{store.storeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {new Date(store.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
