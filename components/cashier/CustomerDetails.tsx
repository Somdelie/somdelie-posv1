import { Plus, Star } from "lucide-react";
import { Button } from "../ui/button";
import { CustomerCardProps } from "./CustomerCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatPrice } from "@/lib/formatPrice";

const CustomerDetails = ({ customer }: CustomerCardProps) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">{customer.fullName}</h2>
            <p className="text-sm text-gray-600">Email: {customer.email}</p>
          </div>
          <p className="text-sm text-gray-600 mb-1">Phone: {customer.phone}</p>
          <p className="text-sm text-gray-600">Address: {customer.address}</p>
        </div>
        <Button size="sm">
          <Plus />
          Add Points
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="size-4 text-yellow-500" />
              <span className="text-sm text-gray-500">
                {customer?.loyaltyPoints}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Total Orders: {customer.purchaseHistory.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Total Spent: {""}
              <span className="font-semibold text-green-700">
                {formatPrice(
                  customer.purchaseHistory.reduce(
                    (acc, item) => acc + item.totalAmount,
                    0
                  )
                )}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 font-semibold">
              {formatPrice(customer.averageOrderValue || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetails;
