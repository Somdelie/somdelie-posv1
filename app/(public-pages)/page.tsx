import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Somdelie-Pos
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Smart Point of Sale System for Modern Businesses
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-foreground">
              Manage sales, inventory, cashiers, reports, and customers with
              speed and precision.
            </p>
          </div>
          <Link href="/store/cashier/customer-management">
            <Button className="mt-6">Go to Customer Management</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
