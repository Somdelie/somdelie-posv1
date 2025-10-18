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
