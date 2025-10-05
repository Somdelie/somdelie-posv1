"use client";

import CustomerDetails from "@/components/cashier/CustomerDetails";
import CustomerList, { customers } from "@/components/cashier/CustomerList";
import CustomerSearch from "@/components/cashier/CustomerSearch";
import PurchaseHistory from "@/components/cashier/PurchaseHistory";
import React, { useState } from "react";
import { CustomerCardProps } from "./CustomerCard";

const CustomerManagement = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<
    CustomerCardProps["customer"]
  >(customers[0]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-1/3 border-r flex flex-col px-4 overflow-y-auto">
        <CustomerSearch />
        <CustomerList
          onCustomerSelect={setSelectedCustomer}
          selectedCustomerId={selectedCustomer.id}
        />
      </div>

      <div className="w-2/3 flex flex-col">
        <CustomerDetails customer={selectedCustomer} />
        <PurchaseHistory orders={selectedCustomer.purchaseHistory} />
      </div>
    </div>
  );
};

export default CustomerManagement;
