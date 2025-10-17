import { getCurrentUser } from "@/lib/actions/auth";
import { getStoreBranches } from "@/lib/actions/branches";
import BranchesClient from "@/components/store/branches/BranchesClient";
import { redirect } from "next/navigation";

export default async function BranchesPage() {
  // Get current user to extract storeId
  const user = await getCurrentUser();

  console.log("Fetching branches for user:", user);

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    console.error("No storeId found for user:", user);
    redirect("/create-store");
  }

  // Debug logging
  console.log("User object:", {
    id: user.id,
    email: user.email,
    role: user.role,
    storeId: user.storeId,
  });

  // Fetch branches for the store
  const result = await getStoreBranches(user.storeId);

  console.log("Fetched branches for store:", {
    storeId: user.storeId,
    result,
  });

  const initialBranches = result.success ? result.branches || [] : [];

  // Pass storeId to client component for creating new branches
  return (
    <BranchesClient
      initialBranches={initialBranches}
      storeId={user.storeId}
      errorMessage={result.success ? null : result.error}
    />
  );
}
