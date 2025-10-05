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
  RefreshCcwIcon,
  ClockIcon,
  AlertTriangleIcon,
  XCircleIcon,
} from "lucide-react";
import React from "react";

const shiftData = {
  refunds: [
    {
      id: 1,
      orderNumber: "ORD-1005",
      refundedAt: "2024-06-01 11:00 AM",
      reason: "Damaged item returned",
      amount: 500,
    },
    {
      id: 2,
      orderNumber: "ORD-1003",
      refundedAt: "2024-06-01 11:15 AM",
      reason: "Wrong size",
      amount: 750,
    },
    {
      id: 3,
      orderNumber: "ORD-1001",
      refundedAt: "2024-06-01 11:30 AM",
      reason: "Customer changed mind",
      amount: 300,
    },
    {
      id: 4,
      orderNumber: "ORD-1007",
      refundedAt: "2024-06-01 11:45 AM",
      reason: "Defective product",
      amount: 1200,
    },
  ],
};

const RefundsTable = () => {
  const getReasonIcon = (reason: string) => {
    if (
      reason.toLowerCase().includes("damaged") ||
      reason.toLowerCase().includes("defective")
    ) {
      return <AlertTriangleIcon className="size-3 text-red-600" />;
    }
    return <XCircleIcon className="size-3 text-orange-600" />;
  };

  const getReasonBadge = (reason: string) => {
    if (
      reason.toLowerCase().includes("damaged") ||
      reason.toLowerCase().includes("defective")
    ) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-red-50 via-rose-50 to-pink-100 dark:from-red-950 dark:via-rose-950 dark:to-pink-950 hover:shadow transition-all duration-300 group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-rose-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>

      <CardContent className="relative z-10 p-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 px-6 pt-6">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded flex items-center justify-center shadow-md">
            <RefreshCcwIcon className="size-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-red-800 to-rose-600 dark:from-red-200 dark:to-rose-400 bg-clip-text text-transparent">
            Refunds
          </h2>
        </div>

        {/* Table Container */}
        <div className="px-6 pb-6">
          <div className="rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-red-200/50 dark:border-red-700/50 bg-red-100/50 dark:bg-red-800/50">
                  <TableHead className="text-red-700 dark:text-red-300 font-semibold text-xs">
                    Order #
                  </TableHead>
                  <TableHead className="text-red-700 dark:text-red-300 font-semibold text-xs">
                    Time
                  </TableHead>
                  <TableHead className="text-red-700 dark:text-red-300 font-semibold text-xs">
                    Reason
                  </TableHead>
                  <TableHead className="text-red-700 dark:text-red-300 font-semibold text-xs text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftData.refunds.slice(-3).map((refund) => (
                  <TableRow
                    key={refund.id}
                    className="border-red-200/30 dark:border-red-700/30 hover:bg-red-100/50 dark:hover:bg-red-800/50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                      {refund.orderNumber}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="size-3 text-slate-500" />
                        <span className="text-xs">
                          {refund.refundedAt.split(" ").slice(1).join(" ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getReasonIcon(refund.reason)}
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full truncate max-w-24 ${getReasonBadge(
                            refund.reason
                          )}`}
                          title={refund.reason}
                        >
                          {refund.reason.length > 15
                            ? refund.reason.substring(0, 15) + "..."
                            : refund.reason}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600 dark:text-red-400 text-sm">
                      -{formatPrice(refund.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Footer */}
          <div className="mt-3 p-2 rounded bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 border border-red-200/50 dark:border-red-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 rounded flex items-center justify-center shadow">
                  <RefreshCcwIcon className="size-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Total Refunds: {shiftData.refunds.length}
                </span>
              </div>
              <span className="text-sm font-bold text-red-700 dark:text-red-300">
                -
                {formatPrice(
                  shiftData.refunds.reduce(
                    (sum, refund) => sum + refund.amount,
                    0
                  )
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default RefundsTable;
