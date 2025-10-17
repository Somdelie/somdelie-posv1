import { getCurrentUser } from "@/lib/actions/auth";
import { notFound, redirect } from "next/navigation";
import StoreProductsClient from "@/components/store/products/StoreProductsClient";

export default async function StoreProductsPage() {
  const user = await getCurrentUser();
  if (!user) return notFound();
  if (!user.storeId) redirect("/create-store");
  return <StoreProductsClient storeId={user.storeId} />;
}
