import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import ReturnRefundFormClient from "@/components/cashier/refunds/ReturnRefundFormClient";

export default async function ReturnRefundPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    redirect("/store/cashier/refunds");
  }

  return <ReturnRefundFormClient userId={user.id} storeId={user.storeId} />;
}
