import ReturnDetails from "@/components/cashier/refunds/ReturnDetails";

type RefundDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Sample order data - in production, this would come from a database query
const orderData = {
  id: 13,
  orderNumber: "Order 13",
  createdAt: "Jul 12, 2025, 09:47 PM",
  paymentMethod: "CASH",
  customer: {
    fullName: "Chitrodo Sharma",
    phone: "7659123890",
    email: "chitrodo@example.com",
    address: "123 Main St, Cityville, ST 12345",
  },
  totalItems: 2,
  orderTotal: 998.0,
  items: [
    {
      id: "18",
      name: "Men Geometric Print Polo Neck Pure Cotton Black T-Shirt",
      quantity: 1,
      price: 599.0,
    },
    {
      id: "19",
      name: "Men Slim Fit Checkered Spread Collar Casual Shirt (Pack of 2)",
      quantity: 1,
      price: 399.0,
    },
  ],
  cashier: {
    fullName: "John Doe",
    id: "cashier-1",
  },
  refund: {
    id: "refund-1",
    reason: "Damaged item returned",
    amount: 500,
    createdAt: "2024-06-01 11:00 AM",
    refundMethod: "CASH",
    itemsReturned: [
      {
        id: "18",
        name: "Men Geometric Print Polo Neck Pure Cotton Black T-Shirt",
        quantity: 1,
        refundAmount: 299.0,
      },
      {
        id: "19",
        name: "Men Slim Fit Checkered Spread Collar Casual Shirt (Pack of 2)",
        quantity: 1,
        refundAmount: 201.0,
      },
    ],
  },
};

export default async function RefundDetailsPage({
  params,
}: RefundDetailsPageProps) {
  const { id } = await params;

  return <ReturnDetails order={orderData} />;
}
