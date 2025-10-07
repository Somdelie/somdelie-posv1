"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  AlertCircle,
  Clock,
  Calendar,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { DataTableDemo } from "@/components/common/DataTable";

export default function BranchManagerPage() {
  const { user } = useAppSelector((state) => state.auth);

  const branchStats = {
    dailySales: 12450.0,
    weeklySales: 78300.0,
    monthlySales: 324500.0,
    totalEmployees: 12,
    activeShifts: 8,
    todayCustomers: 145,
    lowStockItems: 5,
    pendingOrders: 3,
  };

  const topProducts = [
    { name: "Men's Formal Shirt", sold: 45, revenue: 6750.0 },
    { name: "Women's Dress", sold: 32, revenue: 9600.0 },
    { name: "Sports Shoes", sold: 28, revenue: 8400.0 },
    { name: "Casual Jeans", sold: 25, revenue: 3750.0 },
    { name: "T-Shirt Pack", sold: 52, revenue: 2600.0 },
  ];

  const employeePerformance = [
    {
      name: "John Doe",
      role: "Cashier",
      sales: 15,
      amount: 4250.0,
      rating: 4.8,
    },
    {
      name: "Jane Smith",
      role: "Cashier",
      sales: 12,
      amount: 3890.0,
      rating: 4.9,
    },
    {
      name: "Mike Johnson",
      role: "Cashier",
      sales: 10,
      amount: 2950.0,
      rating: 4.6,
    },
    {
      name: "Sarah Williams",
      role: "Sales",
      sales: 8,
      amount: 1860.0,
      rating: 4.7,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branch Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.fullName || "Manager"}
          </p>
          <Badge variant="outline" className="mt-2">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Manage Staff
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Today's Sales
              <DollarSign className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{branchStats.dailySales.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Active Staff
              <UserCheck className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branchStats.activeShifts}/{branchStats.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Employees on shift
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Customers Today
              <Users className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {branchStats.todayCustomers}
            </div>
            <p className="text-xs text-blue-600 flex items-center mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.3% from average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Low Stock Alert
              <AlertCircle className="w-4 h-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {branchStats.lowStockItems}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Items need reorder
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R{branchStats.dailySales.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Total revenue for today
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R{branchStats.weeklySales.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Total revenue this week
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                R{branchStats.monthlySales.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Total revenue this month
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sold} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      R{product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Employee Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeePerformance.map((employee) => (
                <div
                  key={employee.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.role} • {employee.sales} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      R{employee.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">
                        {employee.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Branch Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTableDemo />
        </CardContent>
      </Card>
    </div>
  );
}
