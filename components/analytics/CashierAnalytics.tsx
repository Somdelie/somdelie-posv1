"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AnalyticsSummaryCards,
  PaymentBreakdownCard,
} from "@/components/analytics/AnalyticsSummaryCards";
import { DailyRevenueChart } from "@/components/analytics/DailyRevenueChart";
import { DateRangeSelector } from "@/components/analytics/DateRangeSelector";
import {
  getCashierSummary,
  getCashierDaily,
  AnalyticsSummaryDTO,
  DailyTotalDTO,
} from "@/lib/actions/analytics";
import { Skeleton } from "@/components/ui/skeleton";

interface CashierAnalyticsProps {
  cashierId: string;
}

export function CashierAnalytics({ cashierId }: CashierAnalyticsProps) {
  const [summary, setSummary] = useState<AnalyticsSummaryDTO | null>(null);
  const [dailyData, setDailyData] = useState<DailyTotalDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(),
  });

  useEffect(() => {
    fetchAnalytics(dateRange.from, dateRange.to);
  }, [dateRange, cashierId]);

  const fetchAnalytics = async (from: Date, to: Date) => {
    setLoading(true);
    try {
      const [summaryData, daily] = await Promise.all([
        getCashierSummary(cashierId, from, to),
        getCashierDaily(cashierId, from, to),
      ]);

      console.log("📊 Cashier Analytics Data:", {
        summaryData,
        daily,
        from: from.toISOString(),
        to: to.toISOString(),
      });

      setSummary(summaryData);
      setDailyData(daily || []);
    } catch (error) {
      console.error("Error fetching cashier analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

  console.log(summary, "This is summary data");

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-end">
        <DateRangeSelector onRangeChange={handleDateRangeChange} />
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : summary ? (
        <>
          <AnalyticsSummaryCards
            summary={summary}
            period="in selected period"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <DailyRevenueChart dailyData={dailyData} />
            </div>
            <div>
              <PaymentBreakdownCard summary={summary} />
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              Unable to load analytics data. Please try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
