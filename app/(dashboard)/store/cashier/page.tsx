import CashierDetails from "@/components/cashier/CashierDetails";

export default function CashierPage() {
  return (
    <div className="pb-4">
      <h1 className="text-center font-bold text-2xl">POS Terminal</h1>
      <p className="text-center text-gray-400">Cashier new Order</p>
      <CashierDetails />
    </div>
  );
}
