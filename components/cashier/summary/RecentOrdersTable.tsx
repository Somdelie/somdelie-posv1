import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ReceiptIcon,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  ClockIcon,
} from "lucide-react";
import React from "react";

const shiftData = {
  recentOrders: [
    {
      id: 1,
      orderNumber: "ORD-1001",
      createdAt: "2024-06-01 10:00 AM",
      paymentType: "CASH",
      totalAmount: 2500,
    },
    {
      id: 2,
      orderNumber: "ORD-1002",
      createdAt: "2024-06-01 10:15 AM",
      paymentType: "CARD",
      totalAmount: 1800,
    },
    {
      id: 3,
      orderNumber: "ORD-1003",
      createdAt: "2024-06-01 10:30 AM",
      paymentType: "UPI",
      totalAmount: 3200,
    },
    {
      id: 4,
      orderNumber: "ORD-1004",
      createdAt: "2024-06-01 10:45 AM",
      paymentType: "CARD",
      totalAmount: 950,
    },
  ],
};

const RecentOrdersTable = () => {
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <BanknoteIcon className="size-3 text-green-600" />;
      case "CARD":
        return <CreditCardIcon className="size-3 text-blue-600" />;
      case "UPI":
        return <SmartphoneIcon className="size-3 text-purple-600" />;
      default:
        return <CreditCardIcon className="size-3 text-gray-600" />;
    }
  };

  const getPaymentBadge = (type: string) => {
    const colors = {
      CASH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      CARD: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      UPI: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950 hover:shadow transition-all duration-300 group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-400/10 via-gray-400/10 to-zinc-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-slate-400/20 to-zinc-500/20 rounded-full blur-xl animate-pulse"></div>

      <CardContent className="relative z-10 p-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 px-6 pt-6">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-zinc-600 rounded flex items-center justify-center shadow">
            <ReceiptIcon className="size-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-zinc-600 dark:from-slate-200 dark:to-zinc-400 bg-clip-text text-transparent">
            Recent Orders
          </h2>
        </div>

        {/* Table Container */}
        <div className="px-6 pb-6">
          <div className="rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-800/50">
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
                    Order #
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
                    Time
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
                    Payment
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300 font-semibold text-xs text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftData.recentOrders.slice(-3).map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-slate-200/80 dark:border-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="size-3 text-slate-500" />
                        <span className="text-xs">
                          {order.createdAt.split(" ").slice(1).join(" ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(order.paymentType)}
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentBadge(
                            order.paymentType
                          )}`}
                        >
                          {order.paymentType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Footer */}
          <div className="mt-3 p-2 rounded bg-gradient-to-r from-slate-100 to-zinc-100 dark:from-slate-900/40 dark:to-zinc-900/40 border border-slate-200/50 dark:border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-slate-500 to-zinc-600 rounded flex items-center justify-center shadow-sm">
                  <ReceiptIcon className="size-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Total Recent Orders: {shiftData.recentOrders.length}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {formatPrice(
                  shiftData.recentOrders.reduce(
                    (sum, order) => sum + order.totalAmount,
                    0
                  )
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;
