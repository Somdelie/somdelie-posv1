import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import {
  TrendingUpIcon,
  RefreshCcwIcon,
  DollarSignIcon,
  BarChart3Icon,
} from "lucide-react";
import React from "react";

const shiftData = {
  cashier: {
    fullName: "John Doe",
  },
  totalOrders: 45,
  totalSales: 10000,
  totalRefunds: 500,
  netSales: 9500,
};

const SalesSummaryCard = () => {
  const refundRate = (
    (shiftData.totalRefunds / shiftData.totalSales) *
    100
  ).toFixed(1);

  return (
    <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950 hover:shadow transition-all duration-300 group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse"></div>

      <CardContent className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center shadow-md">
            <BarChart3Icon className="size-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-800 to-teal-600 dark:from-emerald-200 dark:to-teal-400 bg-clip-text text-transparent">
            Sales Summary
          </h2>
        </div>

        {/* Sales Information */}
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                <DollarSignIcon className="size-3 text-white" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Total Sales:
              </span>
            </div>
            <span className="font-bold text-sm text-green-600 dark:text-green-400">
              {formatPrice(shiftData.totalSales)}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-rose-500 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                <RefreshCcwIcon className="size-3 text-white" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Refunds:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-red-500">
                {formatPrice(shiftData.totalRefunds)}
              </span>
              <span className="text-xs text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                {refundRate}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 border border-emerald-200/50 dark:border-emerald-700/30 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-900/60 dark:hover:to-teal-900/60 transition-all duration-200 group/item">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                <TrendingUpIcon className="size-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Net Sales:
              </span>
            </div>
            <span className="font-bold text-lg text-emerald-700 dark:text-emerald-300">
              {formatPrice(shiftData.netSales)}
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-4 h-0.5 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default SalesSummaryCard;
