"use client";

import { useState, useEffect } from "react";
import PaymentSummaryCard from "@/components/cashier/summary/PaymentSummaryCard";
import RecentOrdersTable from "@/components/cashier/summary/RecentOrdersTable";
import RefundsTable from "@/components/cashier/summary/RefundsTable";
import SalesSummaryCard from "@/components/cashier/summary/SalesSummaryCard";
import ShiftInformationCard from "@/components/cashier/summary/ShiftInformationCard";
import ShiftReportHeader from "@/components/cashier/summary/ShiftReportHeader";
import TopSellingItems from "@/components/cashier/summary/TopSellingItems";
import { getCurrentShift, type ShiftReport } from "@/lib/actions/shift";
import { RefreshCw } from "lucide-react";
import React from "react";

export default function CashierSummaryPage() {
  const [currentShift, setCurrentShift] = useState<ShiftReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  const fetchCurrentShift = async () => {
    setLoading(true);
    try {
      const result = await getCurrentShift();
      if (result.success && result.data) {
        setCurrentShift(result.data);
      } else {
        setCurrentShift(null);
      }
    } catch (error) {
      console.error("Error fetching shift:", error);
      setCurrentShift(null);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <ShiftReportHeader />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="size-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // No active shift - only show ShiftInformationCard
  if (!currentShift) {
    return (
      <div className="h-full flex flex-col">
        <ShiftReportHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <ShiftInformationCard onShiftStarted={fetchCurrentShift} />
          </div>
        </div>
      </div>
    );
  }

  // Active shift - show all components
  return (
    <div className="h-full flex flex-col">
      <ShiftReportHeader />
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <ShiftInformationCard
            onShiftStarted={fetchCurrentShift}
            shift={currentShift}
          />
          <SalesSummaryCard
            totalSales={currentShift.totalSales}
            totalRefunds={currentShift.totalRefunds}
            netSales={currentShift.netSale}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <PaymentSummaryCard
            paymentSummaries={currentShift.paymentSummaries || []}
          />
          <TopSellingItems
            topSellingProducts={currentShift.topSellProducts || []}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <RecentOrdersTable recentOrders={currentShift.recentOrders || []} />
          <RefundsTable refunds={currentShift.refunds || []} />
        </div>
      </div>
    </div>
  );
}
