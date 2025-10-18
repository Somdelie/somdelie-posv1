import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function StoreAdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ROLE_STORE_ADMIN") {
    redirect("/");
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Store Admin Analytics</h1>
    </div>
  );
}
