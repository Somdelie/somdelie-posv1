"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AnalyticsSummaryCards,
//   PaymentBreakdownCard,
// } from "@/components/analytics/AnalyticsSummaryCards";
// import { DailyRevenueChart } from "@/components/analytics/DailyRevenueChart";
// import { DateRangeSelector } from "@/components/analytics/DateRangeSelector";
// import {
//   getGlobalSummary,
//   getGlobalDaily,
//   AnalyticsSummaryDTO,
//   DailyTotalDTO,
// } from "@/lib/actions/analytics";
import { Shield, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuperAdminDashboardPage() {
  // const [summary, setSummary] = useState<AnalyticsSummaryDTO | null>(null);
  // const [dailyData, setDailyData] = useState<DailyTotalDTO[]>([]);
  const [loading, setLoading] = useState(true);
  // const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
  //   from: new Date(new Date().setHours(0, 0, 0, 0)),
  //   to: new Date(),
  // });

  // useEffect(() => {
  //   fetchAnalytics(dateRange.from, dateRange.to);
  // }, [dateRange]);

  // const fetchAnalytics = async (from: Date, to: Date) => {
  //   setLoading(true);
  //   try {
  //     const [summaryData, daily] = await Promise.all([
  //       getGlobalSummary(from, to),
  //       getGlobalDaily(from, to),
  //     ]);
  //
  //     setSummary(summaryData);
  //     setDailyData(daily || []);
  //   } catch (error) {
  //     console.error("Error fetching analytics:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDateRangeChange = (from: Date, to: Date) => {
  //   setDateRange({ from, to });
  // };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Global analytics across all stores
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            Analytics modules are temporarily disabled.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
