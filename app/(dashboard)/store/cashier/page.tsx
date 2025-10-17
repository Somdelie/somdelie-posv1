import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import POSClient from "@/components/cashier/POSClient";

export default async function CashierPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Store Not Assigned
          </h2>
          <p className="text-slate-600">
            Please contact your administrator to assign you to a store.
          </p>
        </div>
      </div>
    );
  }

  return (
    <POSClient
      storeId={user.storeId}
      branchId={user.branchId}
      userId={user.id}
    />
  );
}
