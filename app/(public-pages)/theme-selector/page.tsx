import CustomerCard from "@/components/cashier/CustomerCard";
import { customers } from "@/components/cashier/CustomerList";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeSelector } from "@/components/ui/theme-selector";
import {
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  BarChart3Icon,
} from "lucide-react";

export default function Page() {
  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="h-8 w-8 bg-accent rounded-md flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">
                S
              </span>
            </div>
            <span className="font-semibold text-foreground">Somdelie-Pos</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Current Customer
              </h3>
              <CustomerCard customer={customers[0]} />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-md transition-colors">
                  <HomeIcon className="h-4 w-4" />
                  Dashboard
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-md transition-colors">
                  <UsersIcon className="h-4 w-4" />
                  Customers
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-md transition-colors">
                  <ShoppingCartIcon className="h-4 w-4" />
                  Sales
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-md transition-colors">
                  <BarChart3Icon className="h-4 w-4" />
                  Reports
                </button>
              </div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border mx-2" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="text-center mb-12">
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
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <ThemeSelector />
          </div>

          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Customer Management
            </h2>
            {/* <CustomerCard customer={sampleCustomer} /> */}
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
