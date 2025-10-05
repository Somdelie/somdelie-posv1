import { RefundsListClient } from "@/components/cashier/refunds/RefundsListClient";

// Sample refund data - in production, this would come from a database
const refundsData = [
  {
    id: "1",
    order: {
      orderNumber: "ORD-2024-001",
      id: "order-1",
    },
    reason: "Damaged item returned",
    amount: 500,
    cashier: {
      fullName: "John Doe",
      id: "cashier-1",
    },
    paymentType: "CASH",
    createdAt: "2024-06-01 11:00 AM",
  },
  {
    id: "2",
    order: {
      orderNumber: "ORD-2024-003",
      id: "order-3",
    },
    reason: "Wrong size",
    amount: 750,
    cashier: {
      fullName: "Jane Smith",
      id: "cashier-2",
    },
    paymentType: "CARD",
    createdAt: "2024-06-01 11:15 AM",
  },
  {
    id: "3",
    order: {
      orderNumber: "ORD-2024-005",
      id: "order-5",
    },
    reason: "Customer changed mind",
    amount: 300,
    cashier: {
      fullName: "John Doe",
      id: "cashier-1",
    },
    paymentType: "UPI",
    createdAt: "2024-06-01 11:30 AM",
  },
  {
    id: "4",
    order: {
      orderNumber: "ORD-2024-007",
      id: "order-7",
    },
    reason: "Defective product",
    amount: 1200,
    cashier: {
      fullName: "Jane Smith",
      id: "cashier-2",
    },
    paymentType: "CARD",
    createdAt: "2024-06-01 11:45 AM",
  },
  {
    id: "5",
    order: {
      orderNumber: "ORD-2024-010",
      id: "order-10",
    },
    reason: "Color mismatch",
    amount: 890,
    cashier: {
      fullName: "Mike Johnson",
      id: "cashier-3",
    },
    paymentType: "CASH",
    createdAt: "2024-06-01 12:30 PM",
  },
  {
    id: "6",
    order: {
      orderNumber: "ORD-2024-012",
      id: "order-12",
    },
    reason: "Quality issue",
    amount: 1500,
    cashier: {
      fullName: "John Doe",
      id: "cashier-1",
    },
    paymentType: "UPI",
    createdAt: "2024-06-01 01:15 PM",
  },
];

export default function RefundsPage() {
  return <RefundsListClient refunds={refundsData} />;
}
