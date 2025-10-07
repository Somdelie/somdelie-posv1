"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
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
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
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
import { logoutAction } from "@/lib/actions/auth";
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
    { label: "Dashboard", href: "/store", icon: BarChart3 },
    { label: "Branches", href: "/store/branches", icon: Building2 },
    { label: "Products", href: "/store/products", icon: Package },
    { label: "Employees", href: "/store/employees", icon: Users },
    { label: "Sales", href: "/store/sales", icon: DollarSign },
    { label: "Reports", href: "/store/reports", icon: FileText },
    { label: "Settings", href: "/store/settings", icon: Settings },
  ],
  ROLE_CASHIER: [
    { label: "Dashboard", href: "/cashier/dashboard", icon: BarChart3 },
    { label: "POS", href: "/cashier/pos", icon: ShoppingCart },
    { label: "Products", href: "/cashier/products", icon: Package },
    { label: "Orders", href: "/cashier/orders", icon: ShoppingCart },
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
  const { user } = useAuth();
  const pathname = usePathname();

  // Generate breadcrumb based on current path
  const getBreadcrumb = () => {
    if (pathname.includes('/store')) {
      if (pathname.includes('/admin')) {
        return ['Store', 'Admin'];
      }
      return ['Store'];
    }
    if (pathname.includes('/admin')) {
      return ['Admin'];
    }
    if (pathname.includes('/cashier')) {
      return ['Cashier'];
    }
    if (pathname.includes('/super-admin')) {
      return ['Super Admin'];
    }
    return ['Dashboard'];
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-1">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Cautie Shoppings</h1>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                  <span className={index === breadcrumbs.length - 1 ? "text-primary" : ""}>
                    {crumb}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <ModeToggle />
          
          {user && (
            <div className="flex items-center space-x-2">
              <span className="hidden md:block text-sm text-muted-foreground">
                {user.email} ({user.role})
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={logoutAction} className="w-full">
                      <button type="submit" className="flex w-full items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}