import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import OrderHistoryTable from "@/components/cashier/order-history/OrderHistoryTable";

export default async function OrderHistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <OrderHistoryTable userId={user.id} />
      </div>
    </div>
  );
}
