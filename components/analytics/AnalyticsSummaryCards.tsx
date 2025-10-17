"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { AnalyticsSummaryDTO } from "@/lib/actions/analytics";
import { formatPrice } from "@/lib/formatPrice";

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummaryDTO;
  period?: string;
}

export function AnalyticsSummaryCards({
  summary,
  period = "this period",
}: AnalyticsSummaryCardsProps) {
  console.log("💳 Summary Cards Data:", summary);

  const cashPayment = summary.payments.find((p) => p.paymentType === "CASH");
  const cardPayment = summary.payments.find((p) => p.paymentType === "CARD");
  const mobilePayment = summary.payments.find(
    (p) => p.paymentType === "MOBILE_MONEY"
  );

  console.log("💰 Payment Breakdown:", {
    cash: cashPayment,
    card: cardPayment,
    mobile: mobilePayment,
  });

  //   const formatCurrency = (amount: number) => {
  //     return new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //       minimumFractionDigits: 2,
  //     }).format(amount);
  //   };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(summary.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {summary.ordersCount} orders {period}
          </p>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.ordersCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Average:{" "}
            {summary.ordersCount > 0
              ? formatPrice(summary.totalRevenue / summary.ordersCount)
              : formatPrice(0)}{" "}
            per order
          </p>
        </CardContent>
      </Card>

      {/* Cash Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(cashPayment?.amount || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {cashPayment?.count || 0} transactions
          </p>
        </CardContent>
      </Card>

      {/* Card & Mobile Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Digital Payments
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPrice(
              (cardPayment?.amount || 0) + (mobilePayment?.amount || 0)
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              Card: {cardPayment?.count || 0}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Mobile: {mobilePayment?.count || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PaymentBreakdownCardProps {
  summary: AnalyticsSummaryDTO;
}

export function PaymentBreakdownCard({ summary }: PaymentBreakdownCardProps) {
  //   const formatCurrency = (amount: number) => {
  //     return new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //       minimumFractionDigits: 2,
  //     }).format(amount);
  //   };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <Banknote className="h-5 w-5 text-green-600" />;
      case "CARD":
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case "MOBILE_MONEY":
        return <Smartphone className="h-5 w-5 text-purple-600" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getPaymentLabel = (type: string) => {
    switch (type) {
      case "CASH":
        return "Cash";
      case "CARD":
        return "Card";
      case "MOBILE_MONEY":
        return "Mobile Money";
      default:
        return type;
    }
  };

  const calculatePercentage = (amount: number) => {
    if (summary.totalRevenue === 0) return 0;
    return ((amount / summary.totalRevenue) * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Payment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summary.payments.map((payment) => (
            <div
              key={payment.paymentType}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {getPaymentIcon(payment.paymentType)}
                <div>
                  <p className="font-medium">
                    {getPaymentLabel(payment.paymentType)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.count} transactions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(payment.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {calculatePercentage(payment.amount)}%
                </p>
              </div>
            </div>
          ))}

          {summary.payments.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No payment data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
