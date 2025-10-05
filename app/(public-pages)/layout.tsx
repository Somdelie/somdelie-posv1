import POSNavbar from "@/components/common/Navbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <POSNavbar />
      {children}
    </div>
  );
}
