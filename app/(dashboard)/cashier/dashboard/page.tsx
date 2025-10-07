import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function CashierDashboard() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Cashier Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your cashier dashboard. Features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}