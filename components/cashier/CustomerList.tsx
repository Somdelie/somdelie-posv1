import React from "react";
import CustomerCard, { CustomerCardProps } from "./CustomerCard";

export const customers = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Cityville",
    loyaltyPoints: 120,
    averageOrderValue: 75.5,
    status: "COMPLETED",
    purchaseHistory: [
      {
        id: 1,
        createdAt: "2023-10-01",
        totalAmount: 150.0,
        status: "COMPLETED",
        paymentMethod: "CARD",
        items: [
          {
            name: "Product 1",
            quantity: 1,
            price: 100.0,
          },
          {
            name: "Product 2",
            quantity: 2,
            price: 25.0,
          },
        ],
      },
      {
        id: 2,
        createdAt: "2023-09-15",
        totalAmount: 75.5,
        status: "COMPLETED",
        paymentMethod: "UPI",
        items: [
          {
            name: "Product 3",
            quantity: 1,
            price: 75.5,
          },
        ],
      },
      {
        id: 3,
        createdAt: "2023-08-30",
        totalAmount: 50.0,
        status: "COMPLETED",
        paymentMethod: "CARD",
        items: [
          {
            name: "Product 4",
            quantity: 1,
            price: 50.0,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    address: "456 Elm St, Townsville",
    loyaltyPoints: 85,
    averageOrderValue: 120.0,
    status: "PENDING",
    purchaseHistory: [
      {
        id: 1,
        createdAt: "2023-10-05",
        totalAmount: 200.0,
        status: "PENDING",
        paymentMethod: "UPI",
        items: [
          {
            name: "Product 5",
            quantity: 1,
            price: 200.0,
          },
          {
            name: "Product 6",
            quantity: 1,
            price: 0.0,
          },
        ],
      },
      {
        id: 2,
        createdAt: "2023-09-20",
        totalAmount: 100.0,
        status: "PENDING",
        paymentMethod: "UPI",
        items: [
          {
            name: "Product 7",
            quantity: 1,
            price: 100.0,
          },
          {
            name: "Product 8",
            quantity: 1,
            price: 0.0,
          },
        ],
      },
      {
        id: 3,
        createdAt: "2023-08-25",
        totalAmount: 80.0,
        status: "PENDING",
        paymentMethod: "UPI",
        items: [
          {
            name: "Product 9",
            quantity: 1,
            price: 80.0,
          },
        ],
      },
      {
        id: 4,
        createdAt: "2023-08-10",
        totalAmount: 60.0,
        status: "PENDING",
        paymentMethod: "UPI",
        items: [
          {
            name: "Product 10",
            quantity: 1,
            price: 60.0,
          },
        ],
      },
      {
        id: 5,
        createdAt: "2023-08-01",
        totalAmount: 40.0,
        status: "PENDING",
        paymentMethod: "UPI",
        items: [
          {
            name: "Product 11",
            quantity: 1,
            price: 40.0,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    fullName: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-123-4567",
    address: "789 Oak St, Villagetown",
    loyaltyPoints: 45,
    averageOrderValue: 300.0,
    status: "CANCELLED",
    purchaseHistory: [
      {
        id: 1,
        createdAt: "2023-10-10",
        totalAmount: 300.0,
        status: "CANCELLED",
        paymentMethod: "CARD",
        items: [
          {
            name: "Product 12",
            quantity: 1,
            price: 300.0,
          },
          {
            name: "Product 13",
            quantity: 1,
            price: 3000.0,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    fullName: "Bob Brown",
    email: "bob.brown@example.com",
    phone: "444-555-6666",
    address: "321 Pine St, Forestville",
    loyaltyPoints: 60,
    averageOrderValue: 200.0,
    status: "COMPLETED",
    purchaseHistory: [
      {
        id: 1,
        createdAt: "2023-10-15",
        totalAmount: 400.0,
        status: "COMPLETED",
        paymentMethod: "CARD",
        items: [
          {
            name: "Product 14",
            quantity: 2,
            price: 200.0,
          },
        ],
      },
      {
        id: 2,
        createdAt: "2023-09-30",
        totalAmount: 200.0,
        status: "COMPLETED",
        paymentMethod: "CASH",
        items: [
          {
            name: "Product 15",
            quantity: 1,
            price: 200.0,
          },
        ],
      },
    ],
  },
];

interface CustomerListProps {
  onCustomerSelect: (customer: CustomerCardProps["customer"]) => void;
  selectedCustomerId: number;
}

const CustomerList: React.FC<CustomerListProps> = ({
  onCustomerSelect,
  selectedCustomerId,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y"></div>
      <h2 className="text-lg font-semibold my-1">Customer List</h2>
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => onCustomerSelect(customer)}
          className={`${selectedCustomerId === customer.id ? "bg-accent" : ""}`}
        >
          <CustomerCard customer={customer} />
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
