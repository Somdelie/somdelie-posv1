"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  Package,
  Users,
  RefreshCw,
  Receipt,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux-toolkit/hooks";
import Link from "next/link";

export default function CashierDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStats = {
    totalSales: 4250.0,
    transactions: 23,
    averageTransaction: 184.78,
    itemsSold: 87,
    customersServed: 19,
  };

  const recentTransactions = [
    { id: "TXN001", amount: 125.5, time: "2 mins ago", items: 3 },
    { id: "TXN002", amount: 89.99, time: "15 mins ago", items: 2 },
    { id: "TXN003", amount: 234.75, time: "28 mins ago", items: 5 },
    { id: "TXN004", amount: 45.0, time: "1 hr ago", items: 1 },
  ];

  const quickActions = [
    {
      label: "New Sale",
      icon: ShoppingCart,
      href: "/store/cashier",
      color: "bg-green-500",
    },
    {
      label: "Customer Lookup",
      icon: Users,
      href: "/store/cashier/customer-lookup",
      color: "bg-blue-500",
    },
    {
      label: "Returns",
      icon: RefreshCw,
      href: "/store/cashier/refunds",
      color: "bg-orange-500",
    },
    {
      label: "Order History",
      icon: Receipt,
      href: "/store/cashier/orders-history",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cashier Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.fullName || "Cashier"}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Time</p>
            <p className="text-lg font-semibold">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Shift Active
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.label}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div
                    className={`${action.color} text-white p-3 rounded-full`}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    R{todayStats.totalSales.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5%
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {todayStats.transactions}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed
                  </p>
                </div>
                <Receipt className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    R{todayStats.averageTransaction.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Per sale</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Items Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{todayStats.itemsSold}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total units
                  </p>
                </div>
                <Package className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {todayStats.customersServed}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Served today
                  </p>
                </div>
                <Users className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link href="/store/cashier/orders-history">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-700 p-2 rounded-full">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.items} items • {transaction.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    R{transaction.amount.toFixed(2)}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
