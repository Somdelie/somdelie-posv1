"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, Menu, User, Settings } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { toast } from "react-toastify";
import { logout } from "@/redux-toolkit/fetures/auth/authSlice";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    setIsAuthenticated(!!jwt || !!user);
  }, [user]);

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");

    if (pathSegments.length === 0) {
      return [{ label: "Home", href: "/", isCurrentPage: true }];
    }

    const breadcrumbs = [{ label: "Home", href: "/", isCurrentPage: false }];

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

    return breadcrumbs;
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

  // Get user initials for avatar fallback
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

  // menu items list
  const menuItems = [
    { label: "Dashboard", href: "/cashier/summary" },
    { label: "Products", href: "/cashier/products" },
    { label: "Orders", href: "/cashier/orders-history" },
    { label: "Refunds", href: "/cashier/refunds" },
    { label: "Customers", href: "/cashier/customers" },
    { label: "Settings", href: "/cashier/settings" },
  ];

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20 shadow px-4 w-full overflow-hidden items-center flex h-[60px] justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger>
              <span className="flex items-center justify-center h-8 w-8 bg-accent transition-colors rounded hover:bg-accent/80">
                <Menu className=" text-white cursor-pointer" />
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="w-74">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Manage your shift and settings here.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Link className="flex items-center" href="/">
            <Image
              src="/logo.png"
              alt="POS System Logo"
              width={40}
              height={40}
              className=""
            />
            <h1 className="text-xl font-bold text-teal-500">POS System</h1>
          </Link>
        </div>

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

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link
              href="/auth/login"
              className="flex items-center gap-1 bg-sky-700 py-1 px-2 rounded shadow text-white font-semibold hover:bg-sky-800 transition-colors"
            >
              <LogIn size={16} /> Login
            </Link>
          ) : (
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
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
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
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
