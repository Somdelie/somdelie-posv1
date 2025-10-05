import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import {
  TrophyIcon,
  TrendingUpIcon,
  ShirtIcon,
  PackageIcon,
} from "lucide-react";
import React from "react";

const shiftData = {
  topSellingProducts: [
    {
      id: 1,
      name: "Men T-Shirt Blue",
      quantity: 50,
      sellingPrice: 1000,
    },
    {
      id: 2,
      name: "Women T-Shirt Red",
      quantity: 30,
      sellingPrice: 1200,
    },
    {
      id: 3,
      name: "Kids Hoodie Green",
      quantity: 20,
      sellingPrice: 1500,
    },
  ],
};

const TopSellingItems = () => {
  const totalQuantitySold = shiftData.topSellingProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-orange-500"; // Gold
      case 1:
        return "from-gray-300 to-gray-500"; // Silver
      case 2:
        return "from-orange-400 to-red-500"; // Bronze
      default:
        return "from-blue-400 to-indigo-500";
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <TrophyIcon className="size-3 text-white" />;
    return <TrendingUpIcon className="size-3 text-white" />;
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 hover:shadow transition-all duration-300 group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"></div>

      <CardContent className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded flex items-center justify-center shadow-md">
            <TrophyIcon className="size-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-orange-800 to-yellow-600 dark:from-orange-200 dark:to-yellow-400 bg-clip-text text-transparent">
            Top Selling Items
          </h2>
        </div>

        {/* Top Selling Products */}
        <div className="space-y-1">
          {shiftData.topSellingProducts.map((product, index) => {
            const percentage = (
              (product.quantity / totalQuantitySold) *
              100
            ).toFixed(1);
            const totalRevenue = product.quantity * product.sellingPrice;

            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-6 h-6 bg-gradient-to-br ${getRankColor(
                      index
                    )} rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200`}
                  >
                    {getRankIcon(index)}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {product.name}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400 font-semibold shrink-0">
                        {percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <PackageIcon className="size-3" />
                        Qty: {product.quantity}
                      </span>
                      <span>@ {formatPrice(product.sellingPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {formatPrice(totalRevenue)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Total Summary */}
          <div className="flex items-center justify-between p-2 rounded bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/40 border border-orange-200/50 dark:border-orange-700/30 hover:from-orange-200 hover:to-yellow-200 dark:hover:from-orange-900/60 dark:hover:to-yellow-900/60 transition-all duration-200 group/item">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                <ShirtIcon className="size-3 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  Total Items Sold
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  Top 3 products
                </span>
              </div>
            </div>
            <span className="font-bold text-lg text-orange-700 dark:text-orange-300">
              {totalQuantitySold}
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-4 h-0.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default TopSellingItems;
