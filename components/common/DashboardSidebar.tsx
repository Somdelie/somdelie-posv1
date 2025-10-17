"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Store,
  Building2,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  Menu,
  LayoutList,
  Rocket,
  LogOut,
  User,
  Search,
  UserPlus,
  History,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

// Role-based menu configuration
const roleMenus = {
  ROLE_USER: [
    { label: "Dashboard", href: "/user/dashboard", icon: BarChart3 },
    { label: "My Orders", href: "/user/orders", icon: ShoppingCart },
    { label: "Profile", href: "/user/profile", icon: User },
    { label: "Settings", href: "/user/settings", icon: Settings },
  ],
  ROLE_SUPER_ADMIN: [
    { label: "Dashboard", href: "/super-admin/dashboard", icon: BarChart3 },
    { label: "Stores", href: "/super-admin/stores", icon: Store },
    { label: "Branches", href: "/super-admin/branches", icon: Building2 },
    { label: "Users", href: "/super-admin/users", icon: Users },
    { label: "Reports", href: "/super-admin/reports", icon: FileText },
    { label: "Profile", href: "/super-admin/profile", icon: User },
    { label: "Settings", href: "/super-admin/settings", icon: Settings },
  ],
  ROLE_ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  ROLE_BRANCH_MANAGER: [
    { label: "Dashboard", href: "/branch-manager", icon: BarChart3 },
    { label: "Cashiers", href: "/branch-manager/cashiers", icon: Users },
    { label: "Products", href: "/branch-manager/products", icon: Package },
    { label: "Sales", href: "/branch-manager/sales", icon: DollarSign },
    { label: "Reports", href: "/branch-manager/reports", icon: FileText },
    { label: "Profile", href: "/branch-manager/profile", icon: User },
    { label: "Settings", href: "/branch-manager/settings", icon: Settings },
  ],
  ROLE_CASHIER: [
    { label: "Dashboard", href: "/store/cashier/summary", icon: BarChart3 },
    { label: "POS", href: "/store/cashier", icon: ShoppingCart },
    {
      label: "Customer Lookup",
      href: "/store/cashier/customer-lookup",
      icon: Search,
    },
    {
      label: "Order History",
      href: "/store/cashier/orders-history",
      icon: History,
    },
    { label: "Refunds", href: "/store/cashier/refunds", icon: RefreshCcw },
    {
      label: "My Performance",
      href: "/store/cashier/performance",
      icon: TrendingUp,
    },
    { label: "Profile", href: "/store/cashier/profile", icon: User },
  ],
  ROLE_BRANCH_CASHIER: [
    { label: "Dashboard", href: "/store/cashier/summary", icon: BarChart3 },
    { label: "POS", href: "/store/cashier", icon: ShoppingCart },
    {
      label: "Customer Lookup",
      href: "/store/cashier/customer-lookup",
      icon: Search,
    },
    {
      label: "Order History",
      href: "/store/cashier/orders-history",
      icon: History,
    },
    { label: "Refunds", href: "/store/cashier/refunds", icon: RefreshCcw },
    {
      label: "My Performance",
      href: "/store/cashier/performance",
      icon: TrendingUp,
    },
    { label: "Profile", href: "/store/cashier/profile", icon: User },
  ],
  ROLE_STORE_ADMIN: [
    { label: "Dashboard", href: "/store", icon: BarChart3 },
    { label: "Store Info", href: "/store/admin", icon: Store },
    { label: "Branches", href: "/store/branches", icon: Building2 },
    { label: "Products", href: "/store/products", icon: Package },
    { label: "Categories", href: "/store/categories", icon: LayoutList },
    { label: "Employees", href: "/store/employees", icon: Users },
    { label: "Sales", href: "/store/sales", icon: DollarSign },
    { label: "Reports", href: "/store/reports", icon: FileText },
    { label: "Profile", href: "/store/profile", icon: User },
    { label: "Settings", href: "/store/settings", icon: Settings },
    { label: "Upgrade Plan", href: "/store/upgrade", icon: Rocket },
  ],
  ROLE_STORE_MANAGER: [
    { label: "Dashboard", href: "/store-manager/dashboard", icon: BarChart3 },
    { label: "Products", href: "/store-manager/products", icon: Package },
    { label: "Employees", href: "/store/employees", icon: Users },
    { label: "Sales", href: "/store-manager/sales", icon: DollarSign },
    { label: "Reports", href: "/store-manager/reports", icon: FileText },
    { label: "Profile", href: "/store-manager/profile", icon: User },
    { label: "Settings", href: "/store-manager/settings", icon: Settings },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Update active menu based on pathname
  useEffect(() => {
    const currentPath = pathname.split("/").pop();
    if (currentPath) {
      setActiveMenu(currentPath.charAt(0).toUpperCase() + currentPath.slice(1));
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user has a store - critical for POS system security
  const hasStore = user?.storeId;
  const needsStoreSetup = user?.role === "ROLE_STORE_ADMIN" && !hasStore;

  // Get menu items for current user role
  const getMenuItems = () => {
    console.log("Sidebar - User:", user);
    console.log("Sidebar - User role:", user?.role);
    console.log("Sidebar - User storeId:", user?.storeId);
    console.log("Sidebar - Needs store setup:", needsStoreSetup);

    // If user needs to create a store, show minimal menu
    if (needsStoreSetup) {
      return [
        { label: "Create Store", href: "/create-store", icon: Store },
        { label: "Profile", href: "/user/profile", icon: User },
      ];
    }

    if (!user?.role || !roleMenus[user.role as keyof typeof roleMenus]) {
      console.log("Sidebar - No menu items found for role:", user?.role);
      return [];
    }
    return roleMenus[user.role as keyof typeof roleMenus];
  };

  const menuItems = getMenuItems();
  console.log("Sidebar - Menu items:", menuItems);
  if (loading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="p-6">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="POS Logo" width={32} height={32} />
            <span className="text-xl font-bold">POS System</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <div className="animate-pulse">
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded" />
              ))}
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="POS Logo" width={32} height={32} />
          <span className="text-xl font-bold">POS System</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {/* Navigation Menu */}
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-muted/80 rounded">
            <p className="text-sm font-medium">{user.email}</p>
            {needsStoreSetup && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-800">
                ⚠️ Please create your store to access all features
              </div>
            )}
          </div>
        )}
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

// Mobile sidebar wrapper
export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <AppSidebar />
      </SheetContent>
    </Sheet>
  );
}

export function DashboardSidebar() {
  return <AppSidebar />;
}
