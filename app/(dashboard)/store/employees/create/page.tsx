import { getCurrentUser } from "@/lib/actions/auth";
import { getStoreBranches } from "@/lib/actions/employees";
import { redirect } from "next/navigation";
import CreateEmployeeForm from "@/components/forms/CreateEmployeeForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function CreateEmployeePage() {
  // Get current user to extract storeId
  const user = await getCurrentUser();

  console.log("Current user on CreateEmployeePage:", user);

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    redirect("/create-store");
  }

  // Check if user has permission to create employees
  if (user.role !== "ROLE_STORE_ADMIN" && user.role !== "ROLE_STORE_MANAGER") {
    redirect("/store");
  }

  // Fetch branches for the store
  const branchesResult = await getStoreBranches(user.storeId);
  const branches = branchesResult.success ? branchesResult.branches : [];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/store/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Create New Employee</h1>
            <p className="text-muted-foreground">
              Add a new team member to your store
            </p>
          </div>
        </div>

        {/* Form */}
        <CreateEmployeeForm storeId={user.storeId} branches={branches} />
      </div>
    </div>
  );
}
