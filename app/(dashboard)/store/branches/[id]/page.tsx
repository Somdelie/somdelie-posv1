import BranchDetailsClient from "@/components/store/branches/BranchDetailsClient";
import { getCurrentUser } from "@/lib/actions/auth";
import { getBranchDetails } from "@/lib/actions/branches";
import { getBranchEmployees } from "@/lib/actions/employees";
import { notFound } from "next/navigation";

export default async function BranchDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const branchRes = await getBranchDetails(params.id);
  if (!branchRes.success || !branchRes.branch) return notFound();

  const employeesRes = await getBranchEmployees(params.id);

  return (
    <BranchDetailsClient
      branch={branchRes.branch}
      employees={employeesRes.success ? employeesRes.employees : []}
      storeId={user.storeId}
    />
  );
}
