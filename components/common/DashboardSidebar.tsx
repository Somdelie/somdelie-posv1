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
  LayoutList, // Added for Categories
  Rocket,
  LogOut, // Added for Upgrade Plan
  User, // Added for Profile
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/redux-toolkit/fetures/user/userThunk";
import { logout } from "@/redux-toolkit/fetures/auth/authSlice";
import { toast } from "react-toastify";
import { getBranchById } from "@/redux-toolkit/fetures/branch/branchThunk";

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
    { label: "Products", href: "/super-admin/products", icon: Package },
    { label: "Categories", href: "/super-admin/categories", icon: LayoutList },
    { label: "Users", href: "/super-admin/users", icon: Users },
    { label: "Alerts", href: "/super-admin/alerts", icon: AlertCircle },
    { label: "Sales", href: "/super-admin/sales", icon: DollarSign },
    { label: "Reports", href: "/super-admin/reports", icon: FileText },
    { label: "Settings", href: "/super-admin/settings", icon: Settings },
  ],
  ROLE_STORE_ADMIN: [
    { label: "Dashboard", href: "/store/admin", icon: BarChart3 },
    { label: "Stores", href: "/store", icon: Store },
    { label: "Branches", href: "/store/branches", icon: Building2 },
    { label: "Products", href: "/store/products", icon: Package },
    { label: "Categories", href: "/store/categories", icon: LayoutList }, // Added
    { label: "Employees", href: "/store/employees", icon: Users },
    { label: "Alerts", href: "/store/alerts", icon: AlertCircle },
    { label: "Sales", href: "/store/sales", icon: DollarSign },
    { label: "Reports", href: "/store/reports", icon: FileText },
    { label: "Upgrade Plan", href: "/store/upgrade-plan", icon: Rocket }, // Added
    { label: "Profile", href: "/store/profile", icon: User },
    { label: "Settings", href: "/store/settings", icon: Settings },
  ],
  ROLE_BRANCH_CASHIER: [
    { label: "Dashboard", href: "/store/cashier/summary", icon: BarChart3 },
    { label: "Products", href: "/store/cashier", icon: Package },
    {
      label: "Orders",
      href: "/store/cashier/orders-history",
      icon: ShoppingCart,
    },
    { label: "Refunds", href: "/store/cashier/refunds", icon: AlertCircle },
    { label: "Customers", href: "/store/cashier/customers", icon: Users },
    { label: "Profile", href: "/store/cashier/profile", icon: User },
    { label: "Settings", href: "/store/cashier/settings", icon: Settings },
  ],
  ROLE_BRANCH_MANAGER: [
    { label: "Dashboard", href: "/branch-manager/dashboard", icon: BarChart3 },
    { label: "Products", href: "/branch-manager/products", icon: Package },
    { label: "Employees", href: "/branch-manager/employees", icon: Users },
    { label: "Sales", href: "/branch-manager/sales", icon: DollarSign },
    { label: "Reports", href: "/branch-manager/reports", icon: FileText },
    { label: "Profile", href: "/branch-manager/profile", icon: User },
    { label: "Settings", href: "/branch-manager/settings", icon: Settings },
  ],
  ROLE_STORE_MANAGER: [
    { label: "Dashboard", href: "/store-manager/dashboard", icon: BarChart3 },
    { label: "Branches", href: "/store-manager/branches", icon: Building2 },
    { label: "Products", href: "/store-manager/products", icon: Package },
    { label: "Employees", href: "/store-manager/employees", icon: Users },
    { label: "Sales", href: "/store-manager/sales", icon: DollarSign },
    { label: "Reports", href: "/store-manager/reports", icon: FileText },
    { label: "Profile", href: "/store-manager/profile", icon: User },
    { label: "Settings", href: "/store-manager/settings", icon: Settings },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userProfile, loading } = useAppSelector((state) => state.user) as {
    userProfile: {
      role: keyof typeof roleMenus;
      branchId?: string;
      storeId?: string;
    } | null;
    loading: boolean;
  };
  const { branch } = useAppSelector((state) => state.branch);
  const { store } = useAppSelector((state: any) => state.store);
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Fetch user profile on mount
  // ✅ clean and reliable version
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && !userProfile) {
      dispatch(getUserProfile(token));
    }
  }, [dispatch, userProfile]);

  useEffect(() => {
    if (userProfile?.branchId) {
      dispatch(getBranchById(userProfile.branchId));
      console.log("Fetching branch:", userProfile.branchId);
    }
  }, [dispatch, userProfile?.branchId]);

  // Fetch store data for ROLE_STORE_ADMIN
  useEffect(() => {
    if (userProfile?.storeId && userProfile.role === "ROLE_STORE_ADMIN") {
      // dispatch(getStoreById(userProfile.storeId));
      console.log("Fetching store:", userProfile.storeId);
    }
  }, [dispatch, userProfile?.storeId, userProfile?.role]);

  // Update active menu based on pathname
  useEffect(() => {
    if (pathname && userProfile?.role) {
      const currentPath = pathname.split("/").pop();
      const menuItems =
        roleMenus[userProfile.role as keyof typeof roleMenus] || [];
      const currentItem = menuItems.find(
        (item) => item.href.split("/").pop() === currentPath
      );
      setActiveMenu(currentItem?.label || "Dashboard");
    }
  }, [pathname, userProfile]);

  // Show loading while fetching profile
  if (loading || !userProfile) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          Loading...
        </div>
      </Sidebar>
    );
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("jwt");

      // Dispatch logout action (if you have one)
      await dispatch(logout());

      toast.success("Logged out successfully!");

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  // Get menu items based on role with fallback
  const menuItems = roleMenus[userProfile.role as keyof typeof roleMenus] || [];

  // Get display title based on user role
  const getDisplayTitle = () => {
    switch (userProfile.role) {
      case "ROLE_SUPER_ADMIN":
        return "Somdelie Pos";
      case "ROLE_STORE_ADMIN":
        return store?.name || "Store Admin";
      case "ROLE_STORE_MANAGER":
        return store?.name || "Store Manager";
      case "ROLE_BRANCH_MANAGER":
      case "ROLE_BRANCH_CASHIER":
        return branch?.name || "Loading...";
      default:
        return "Somdelie Pos";
    }
  };

  console.log(branch, "branch info in sidebar");
  console.log("User role:", userProfile.role);
  console.log("Menu items:", menuItems);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Store className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {menuItems && menuItems.length > 0 ? (
              menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-muted-foreground gap-4 px-2.5 hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))
            ) : (
              <div className="text-sm text-muted-foreground px-2.5">
                No menu items available
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Somdelie Pos"
                  width={32}
                  height={32}
                  className="aspect-square object-contain"
                />
                <span className="text-lg font-bold text-teal-800">
                  {getDisplayTitle()}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarMenu>
          {menuItems && menuItems.length > 0 ? (
            menuItems.map((item) => (
              <SidebarMenuItem
                key={item.label}
                className={
                  activeMenu === item.label
                    ? "bg-green-700 rounded hover:bg-green-700 text-white"
                    : "text-gray-600"
                }
              >
                <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2" />
                    <span className="text-base font-semibold">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              No menu items available for your role
            </div>
          )}
        </SidebarMenu>
        <SidebarFooter className="mt-auto border-t">
          <Button onClick={handleLogout}>
            <LogOut className="mr-2" />
            <span className="text-base font-semibold">Logout</span>
          </Button>
          {/* <div className="p-4 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Somdelie Pos. All rights reserved.
          </div> */}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
