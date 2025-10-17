import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth";
import { getRefundById } from "@/lib/actions/refunds";
import { getOrderById } from "@/lib/actions/orders";
import ReturnDetails from "@/components/cashier/refunds/ReturnDetails";

type RefundDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RefundDetailsPage({
  params,
}: RefundDetailsPageProps) {
  const { id } = await params;

  // Get current user for role-based access control
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch refund data from API
  const refundResult = await getRefundById(id);

  if (!refundResult.success || !refundResult.data) {
    redirect("/store/cashier/refunds");
  }

  const refund = refundResult.data;

  // Role-based access control
  const canAccessRefund = checkRefundAccess(user, refund);

  if (!canAccessRefund) {
    redirect("/store/cashier/refunds");
  }

  // Fetch related order data
  const orderResult = refund.orderId
    ? await getOrderById(refund.orderId)
    : { success: false, data: null };

  if (!orderResult.success || !orderResult.data) {
    redirect("/store/cashier/refunds");
  }

  const order = orderResult.data;

  // Transform API data to match component props
  const orderData = {
    id: parseInt(refund.id.slice(-8), 16) || 0, // Convert UUID to number
    orderNumber: order.orderNumber || `#${order.id.slice(0, 8)}`,
    createdAt: new Date(order.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    paymentMethod: order.paymentType || "CASH",
    customer: {
      fullName: order.customer?.fullName || "Walk-in Customer",
      phone: order.customer?.phone || "N/A",
      email: order.customer?.email,
      address: order.customer?.address,
    },
    totalItems: order.items?.length || 0,
    orderTotal: order.totalAmount || 0,
    items:
      order.items?.map((item) => ({
        id: item.productId,
        name: item.productName || `Product #${item.productId.slice(0, 8)}`,
        quantity: item.quantity,
        price: item.price,
      })) || [],
    cashier: {
      fullName: refund.cashier?.fullName || refund.cashierName || "Unknown",
      id: refund.cashier?.id || "",
    },
    refund: {
      id: refund.id,
      reason: refund.reason,
      amount: refund.amount,
      createdAt: new Date(refund.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      refundMethod: refund.paymentType || "CASH",
      status: "COMPLETED" as const,
      itemsReturned:
        order.items?.map((item) => ({
          id: item.productId,
          name: item.productName || `Product #${item.productId.slice(0, 8)}`,
          quantity: item.quantity,
          refundAmount: item.price * item.quantity,
        })) || [],
    },
  };

  return <ReturnDetails order={orderData} />;
}

/**
 * Check if user has access to view this refund based on their role
 */
function checkRefundAccess(user: any, refund: any): boolean {
  const role = user.role;

  switch (role) {
    case "ROLE_SUPER_ADMIN":
    case "ROLE_STORE_ADMIN":
      // Super Admin and Store Admin can see all refunds
      return true;

    case "ROLE_STORE_MANAGER":
      // Store Manager can see refunds in their store
      return user.storeId === refund.order?.storeId;

    case "ROLE_BRANCH_MANAGER":
      // Branch Manager can see refunds in their branch
      // Use refund.branchId since order might be null
      return (
        user.branchId === refund.branchId ||
        user.branchId === refund.order?.branchId
      );

    case "ROLE_BRANCH_CASHIER":
      // Cashier can see their own refunds
      // Check by ID if cashier object is populated
      if (refund.cashier?.id) {
        return user.id === refund.cashier.id;
      }
      // Fallback: check by fullName if cashierName is populated
      if (refund.cashierName && user.fullName) {
        return user.fullName === refund.cashierName;
      }
      // Last fallback: check by branch (cashiers can see refunds from their branch)
      return user.branchId === refund.branchId;

    default:
      return false;
  }
}
