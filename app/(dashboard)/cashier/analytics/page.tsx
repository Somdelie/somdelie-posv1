import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

// Sample analytics summary data for demonstration
const sampleSummary = {
  totalRevenue: 12000,
  ordersCount: 150,
  payments: [
    { paymentType: "CASH", amount: 7000, count: 80 },
    { paymentType: "CARD", amount: 4000, count: 50 },
    { paymentType: "MOBILE_MONEY", amount: 1000, count: 20 },
  ],
};

export default async function CashierAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ROLE_CASHIER") {
    redirect("/");
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cashier Analytics</h1>
      <div className="my-6"></div>
    </div>
  );
}
