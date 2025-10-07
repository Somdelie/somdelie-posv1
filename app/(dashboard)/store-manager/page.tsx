"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Store,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Building2,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { DataTableDemo } from "@/components/common/DataTable";

export default function StoreManagerPage() {
  const { user } = useAppSelector((state) => state.auth);

  const storeOverview = {
    totalRevenue: 542300.0,
    totalBranches: 5,
    activeBranches: 5,
    totalProducts: 1250,
    totalEmployees: 48,
    monthlyGrowth: 15.3,
    lowStockBranches: 2,
    topPerformingBranch: "Downtown Branch",
  };

  const branchPerformance = [
    {
      name: "Downtown Branch",
      sales: 145800.0,
      growth: 18.5,
      status: "excellent",
      employees: 12,
    },
    {
      name: "Main Store",
      sales: 132400.0,
      growth: 12.3,
      status: "good",
      employees: 15,
    },
    {
      name: "Uptown Branch",
      sales: 98600.0,
      growth: 15.7,
      status: "good",
      employees: 8,
    },
    {
      name: "City Center",
      sales: 87200.0,
      growth: 8.2,
      status: "average",
      employees: 7,
    },
    {
      name: "Suburb Branch",
      sales: 78300.0,
      growth: -3.4,
      status: "concern",
      employees: 6,
    },
  ];

  const inventoryAlerts = [
    { branch: "Downtown Branch", items: 8, severity: "high" },
    { branch: "Suburb Branch", items: 12, severity: "high" },
    { branch: "Uptown Branch", items: 5, severity: "medium" },
    { branch: "City Center", items: 3, severity: "low" },
  ];

  const recentOrders = [
    {
      id: "ORD001",
      branch: "Downtown Branch",
      amount: 5420.0,
      status: "Completed",
      date: "Today",
    },
    {
      id: "ORD002",
      branch: "Main Store",
      amount: 3890.0,
      status: "Processing",
      date: "Today",
    },
    {
      id: "ORD003",
      branch: "Uptown Branch",
      amount: 2150.0,
      status: "Completed",
      date: "Yesterday",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-700 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "average":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "concern":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.fullName || "Store Manager"}
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-green-50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {storeOverview.activeBranches} Branches Active
            </Badge>
            <Badge variant="outline" className="bg-orange-50">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {storeOverview.lowStockBranches} Stock Alerts
            </Badge>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Store className="w-4 h-4 mr-2" />
            Manage Branches
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Revenue
              <DollarSign className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{storeOverview.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />+
              {storeOverview.monthlyGrowth}% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Branches
              <Building2 className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeOverview.totalBranches}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All branches operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Products
              <Package className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeOverview.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all branches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total Staff
              <Users className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeOverview.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Employees company-wide
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Branch Performance
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50">
              Top: {storeOverview.topPerformingBranch}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {branchPerformance.map((branch) => (
              <div
                key={branch.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{branch.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {branch.employees} employees
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      R{branch.sales.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm flex items-center justify-end gap-1 ${
                        branch.growth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {branch.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(branch.growth)}%
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(branch.status)}
                  >
                    {branch.status.charAt(0).toUpperCase() +
                      branch.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryAlerts.map((alert) => (
                <div
                  key={alert.branch}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-500"
                          : alert.severity === "medium"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-semibold">{alert.branch}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.items} items low in stock
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Recent Branch Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.branch} • {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      R{order.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        order.status === "Completed" ? "default" : "secondary"
                      }
                      className="mt-1"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Branch Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTableDemo />
        </CardContent>
      </Card>
    </div>
  );
}
