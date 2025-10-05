import PaymentSummaryCard from "@/components/cashier/summary/PaymentSummaryCard";
import RecentOrdersTable from "@/components/cashier/summary/RecentOrdersTable";
import RefundsTable from "@/components/cashier/summary/RefundsTable";
import SalesSummaryCard from "@/components/cashier/summary/SalesSummaryCard";
import ShiftInformationCard from "@/components/cashier/summary/ShiftInformationCard";
import ShiftReportHeader from "@/components/cashier/summary/ShiftReportHeader";
import TopSellingItems from "@/components/cashier/summary/TopSellingItems";
import React from "react";

export default function CashierSummaryPage() {
  return (
    <div className="hfull flex flex-col">
      <ShiftReportHeader />
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <ShiftInformationCard />
          <SalesSummaryCard />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <PaymentSummaryCard />
          <TopSellingItems />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          <RecentOrdersTable />
          <RefundsTable />
        </div>
      </div>
    </div>
  );
}
