import OrderHistoryTable from "@/components/cashier/order-history/OrderHistoryTable";

export default function OrderHistoryPage() {
  return (
    <div className="h-full flex flex-col ">
      <div className="flex-1 overflow-auto p-4">
        <OrderHistoryTable />
      </div>
    </div>
  );
}
