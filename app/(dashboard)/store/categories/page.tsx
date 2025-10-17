import { getCurrentUser } from "@/lib/actions/auth";
import { notFound, redirect } from "next/navigation";
import StoreCategoriesClient from "@/components/store/categories/StoreCategoriesClient";

export default async function StoreCategoriesPage() {
  const user = await getCurrentUser();
  if (!user) return notFound();
  if (!user.storeId) redirect("/create-store");

  return <StoreCategoriesClient storeId={user.storeId} />;
}
