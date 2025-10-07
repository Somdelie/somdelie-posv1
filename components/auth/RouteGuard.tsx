"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { hasRoutePermission } from "@/lib/auth/permissions";
import type { UserRole } from "@/lib/auth/permissions";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireStore?: boolean;
  requireBranch?: boolean;
}

export function RouteGuard({
  children,
  allowedRoles,
  requireStore = false,
  requireBranch = false,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Check if user is authenticated
    const jwt = localStorage.getItem("jwt");
    if (!jwt || !user) {
      router.push("/auth/login");
      return;
    }

    const userRole = (user.role || user.user?.role) as UserRole;

    // Check if route is allowed for user's role
    if (userRole && !hasRoutePermission(userRole, pathname)) {
      router.push("/not-found");
      return;
    }

    // Check if specific roles are required
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      router.push("/not-found");
      return;
    }

    // If a store is required but missing, send to not-found (onboarding removed)
    if (requireStore && !user.user?.storeId) {
      router.push("/not-found");
      return;
    }

    // Check if branch is required
    if (requireBranch && !user.user?.branchId) {
      router.push("/not-found");
      return;
    }
  }, [
    user,
    loading,
    router,
    pathname,
    allowedRoles,
    requireStore,
    requireBranch,
  ]);

  // Show loading while checking permissions
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
