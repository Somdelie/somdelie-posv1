import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CustomerForm } from "./CustomerForm";

const CustomerSearch = () => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  return (
    <div className="py-4 border-b">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search customers..."
            type={"text"}
            className="pl-10"
          />
        </div>
        <Button
          className="flex items-center"
          onClick={() => setShowCustomerForm(true)}
        >
          <PlusIcon />
          Add New
        </Button>

        {showCustomerForm && (
          <CustomerForm
            showCustomerForm={showCustomerForm}
            setShowCustomerForm={setShowCustomerForm}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerSearch;
