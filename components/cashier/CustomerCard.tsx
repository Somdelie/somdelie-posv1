import type React from "react";
import { Badge } from "../ui/badge";
import { StarIcon } from "lucide-react";

export interface CustomerCardProps {
  customer: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    loyaltyPoints?: number;
    status: string;
    purchaseHistory: {
      id: number;
      createdAt: string;
      totalAmount: number;
      status: string;
      paymentMethod: string;
    }[];
    averageOrderValue?: number;
  };
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <div className="border p-3 cursor-pointer hover:bg-accent">
      <div className="flex items-start justify-between">
        <div className="">
          <h3 className="text-lg font-medium">{customer.fullName}</h3>
          <p className="text-sm text-gray-500">{customer.phone}</p>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </div>
        <Badge>
          <StarIcon className="size-4 mr-1" />
          {customer.loyaltyPoints ?? 0} Points
        </Badge>
      </div>
    </div>
  );
};

export default CustomerCard;
