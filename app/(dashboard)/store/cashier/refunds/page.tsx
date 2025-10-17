import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import RefundsListClient from "@/components/cashier/refunds/RefundsListClient";

export default async function RefundsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <RefundsListClient userId={user.id} />;
}
