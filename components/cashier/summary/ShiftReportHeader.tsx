import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

const ShiftReportHeader = () => {
  return (
    <div className="p-4 bg-card border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-emerald-600">
          Shift Summary
        </h1>
        {/* <div className="flex gap-2">
          <Button variant={"destructive"} className="flex items-center">
            <ArrowRight className="mr-2 h-4 w-4" />
            End Shift & Logout
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default ShiftReportHeader;
