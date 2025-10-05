"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Store,
  Building2,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  Bell,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "react-toastify";
import router from "next/dist/shared/lib/router/router";
import { logout } from "@/redux-toolkit/fetures/auth/authSlice";
import { getUserProfile } from "@/redux-toolkit/fetures/user/userThunk";
import { useRouter, usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ModeToggle } from "./ModeToogle";

// Role-based menu configuration
const roleMenus = {
  ROLE_USER: [
    { label: "Dashboard", href: "/user/dashboard", icon: BarChart3 },
    { label: "My Orders", href: "/user/orders", icon: ShoppingCart },
    { label: "Settings", href: "/user/settings", icon: Settings },
  ],
  ROLE_ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Stores", href: "/admin/stores", icon: Store },
    { label: "Branches", href: "/admin/branches", icon: Building2 },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Employees", href: "/admin/employees", icon: Users },
    { label: "Sales", href: "/admin/sales", icon: DollarSign },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Alerts", href: "/admin/alerts", icon: AlertCircle },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  ROLE_STORE_ADMIN: [
    { label: "Dashboard", href: "/store/dashboard", icon: BarChart3 },
    { label: "Branches", href: "/store/branches", icon: Building2 },
    { label: "Products", href: "/store/products", icon: Package },
    { label: "Employees", href: "/store/employees", icon: Users },
    { label: "Sales", href: "/store/sales", icon: DollarSign },
    { label: "Reports", href: "/store/reports", icon: FileText },
    { label: "Settings", href: "/store/settings", icon: Settings },
  ],
  ROLE_BRANCH_CASHIER: [
    { label: "Dashboard", href: "/cashier/dashboard", icon: BarChart3 },
    { label: "Products", href: "/cashier/products", icon: Package },
    { label: "Orders", href: "/cashier/orders-history", icon: ShoppingCart },
    { label: "Refunds", href: "/cashier/refunds", icon: AlertCircle },
    { label: "Customers", href: "/cashier/customers", icon: Users },
    { label: "Settings", href: "/cashier/settings", icon: Settings },
  ],
  ROLE_BRANCH_MANAGER: [
    { label: "Dashboard", href: "/branch-manager/dashboard", icon: BarChart3 },
    { label: "Products", href: "/branch-manager/products", icon: Package },
    { label: "Employees", href: "/branch-manager/employees", icon: Users },
    { label: "Sales", href: "/branch-manager/sales", icon: DollarSign },
    { label: "Reports", href: "/branch-manager/reports", icon: FileText },
    { label: "Settings", href: "/branch-manager/settings", icon: Settings },
  ],
  ROLE_STORE_MANAGER: [
    { label: "Dashboard", href: "/store-manager/dashboard", icon: BarChart3 },
    { label: "Branches", href: "/store-manager/branches", icon: Building2 },
    { label: "Products", href: "/store-manager/products", icon: Package },
    { label: "Employees", href: "/store-manager/employees", icon: Users },
    { label: "Sales", href: "/store-manager/sales", icon: DollarSign },
    { label: "Reports", href: "/store-manager/reports", icon: FileText },
    { label: "Settings", href: "/store-manager/settings", icon: Settings },
  ],
};

const DashboardNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { userProfile: user } = useAppSelector((state) => state.user) as {
    userProfile: {
      role: keyof typeof roleMenus;
      fullName?: string;
      email?: string;
    } | null;
  };
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // Fetch user profile on mount if not available
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && !user) {
      dispatch(getUserProfile(token));
    }
  }, [dispatch, user]);

  // Update active menu based on current pathname
  useEffect(() => {
    if (!user?.role || !pathname) return;

    const userMenus = roleMenus[user.role as keyof typeof roleMenus] || [];
    const pathSegments = pathname.split("/").filter(Boolean); // split and remove empty segments

    let bestMatchLabel = "Dashboard";
    let bestMatchScore = -1;

    userMenus.forEach((item) => {
      const menuSegments = item.href.split("/").filter(Boolean);
      let matchScore = 0;

      // Count consecutive matching segments
      for (
        let i = 0;
        i < Math.min(menuSegments.length, pathSegments.length);
        i++
      ) {
        if (menuSegments[i] === pathSegments[i]) matchScore++;
        else break;
      }

      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore;
        bestMatchLabel = item.label;
      }
    });

    setActiveMenu(bestMatchLabel);
  }, [pathname, user?.role]);

  // Get profile route based on role
  const getProfileRoute = () => {
    if (!user?.role) return "/profile";
    const roleRoutes: Record<string, string> = {
      ROLE_USER: "/user/profile",
      ROLE_ADMIN: "/admin/profile",
      ROLE_STORE_ADMIN: "/store/profile",
      ROLE_BRANCH_CASHIER: "/store/cashier/profile",
      ROLE_BRANCH_MANAGER: "/branch-manager/profile",
      ROLE_STORE_MANAGER: "/store-manager/profile",
    };
    return roleRoutes[user.role] || "/profile";
  };

  // Get settings route based on role
  const getSettingsRoute = () => {
    if (!user?.role) return "/settings";
    const roleRoutes: Record<string, string> = {
      ROLE_USER: "/user/settings",
      ROLE_ADMIN: "/admin/settings",
      ROLE_STORE_ADMIN: "/store/settings",
      ROLE_BRANCH_CASHIER: "/store/cashier/settings",
      ROLE_BRANCH_MANAGER: "/branch-manager/settings",
      ROLE_STORE_MANAGER: "/store-manager/settings",
    };
    return roleRoutes[user.role] || "/settings";
  };

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

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");

    const breadcrumbs = [];

    if (pathSegments.length === 0) {
      // If no segments, it's likely the root dashboard
      breadcrumbs.push({ label: "Dashboard", href: "/", isCurrentPage: true });
    } else {
      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;

        // Convert segment to readable format (e.g., 'customer-lookup' -> 'Customer Lookup')
        const label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        breadcrumbs.push({
          label,
          href: currentPath,
          isCurrentPage: isLast,
        });
      });
    }
    return breadcrumbs;
  };

  console.log("logged in user:", user?.email);

  const breadcrumbs = generateBreadcrumbs();
  // Get user initials
  const getUserInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return "U";
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-col">
          {" "}
          <h1 className="text-base font-bold">Cautie Shoppings</h1>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.isCurrentPage ? (
                      <BreadcrumbPage className="text-teal-400 font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={crumb.href}
                        className=" hover:text-teal-300 transition-colors"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="text-teal-400/50" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-orange-200 cursor-pointer hover:ring-2 hover:ring-teal-400 transition-all">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={getProfileRoute()} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getSettingsRoute()} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
