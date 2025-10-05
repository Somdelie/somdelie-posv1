import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import {
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  WalletIcon,
} from "lucide-react";
import React from "react";

const shiftData = {
  paymentSummaries: [
    {
      type: "CASH",
      totalAmount: 15000,
      transactionCount: 30,
    },
    {
      type: "CARD",
      totalAmount: 25000,
      transactionCount: 50,
    },
    {
      type: "UPI",
      totalAmount: 10000,
      transactionCount: 20,
    },
  ],
};

const PaymentSummaryCard = () => {
  const totalAmount = shiftData.paymentSummaries.reduce(
    (sum, payment) => sum + payment.totalAmount,
    0
  );
  const totalTransactions = shiftData.paymentSummaries.reduce(
    (sum, payment) => sum + payment.transactionCount,
    0
  );

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <BanknoteIcon className="size-3 text-white" />;
      case "CARD":
        return <CreditCardIcon className="size-3 text-white" />;
      case "UPI":
        return <SmartphoneIcon className="size-3 text-white" />;
      default:
        return <WalletIcon className="size-3 text-white" />;
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case "CASH":
        return "from-green-400 to-emerald-500";
      case "CARD":
        return "from-blue-400 to-indigo-500";
      case "UPI":
        return "from-purple-400 to-violet-500";
      default:
        return "from-gray-400 to-slate-500";
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 hover:shadow transition-all duration-300 group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>

      <CardContent className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center shadow-md">
            <WalletIcon className="size-4 text-white" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-800 to-purple-600 dark:from-indigo-200 dark:to-purple-400 bg-clip-text text-transparent">
            Payment Summary
          </h2>
        </div>

        {/* Payment Methods */}
        <div className="space-y-1">
          {shiftData.paymentSummaries.map((payment, index) => {
            const percentage = (
              (payment.totalAmount / totalAmount) *
              100
            ).toFixed(1);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 bg-gradient-to-br ${getPaymentColor(
                      payment.type
                    )} rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200`}
                  >
                    {getPaymentIcon(payment.type)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {payment.type}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400 font-semibold">
                        {percentage}%
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {payment.transactionCount} transactions
                    </span>
                  </div>
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {formatPrice(payment.totalAmount)}
                </span>
              </div>
            );
          })}

          {/* Total Summary */}
          <div className="flex items-center justify-between p-2 rounded bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-200/50 dark:border-indigo-700/30 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-900/60 dark:hover:to-purple-900/60 transition-all duration-200 group/item">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                <WalletIcon className="size-3 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Total Payments
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400">
                  {totalTransactions} transactions
                </span>
              </div>
            </div>
            <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-4 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummaryCard;
