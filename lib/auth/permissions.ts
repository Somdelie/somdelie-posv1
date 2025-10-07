// Role-based access control utilities

export type UserRole =
  | "ROLE_USER"
  | "ROLE_SUPER_ADMIN"
  | "ROLE_STORE_ADMIN"
  | "ROLE_STORE_MANAGER"
  | "ROLE_BRANCH_MANAGER"
  | "ROLE_BRANCH_CASHIER";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  storeId?: string;
  branchId?: string;
  store?: any;
  branch?: any;
}

// Define which roles can access which routes
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ROLE_USER: ["/user/profile"],

  ROLE_SUPER_ADMIN: [
    "/admin/dashboard",
    "/store/admin",
    "/store/cashier",
    "/store/branches",
    "/branch-manager",
    "/store-manager",
    "/cashier/dashboard",
    "/user/profile",
  ],

  ROLE_STORE_ADMIN: [
    "/store/admin",
    "/store/cashier",
    "/store/branches",
    "/branch-manager",
    "/store-manager",
    "/cashier/dashboard",
    "/user/profile",
  ],

  ROLE_STORE_MANAGER: [
    "/store-manager",
    "/store/branches",
    "/branch-manager",
    "/store/cashier",
    "/cashier/dashboard",
    "/user/profile",
  ],

  ROLE_BRANCH_MANAGER: [
    "/branch-manager",
    "/store/cashier",
    "/cashier/dashboard",
    "/user/profile",
  ],

  ROLE_BRANCH_CASHIER: [
    "/cashier/dashboard",
    "/store/cashier",
    "/user/profile",
  ],
};

// Define role hierarchy (higher roles can access lower role routes)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ROLE_SUPER_ADMIN: 6,
  ROLE_STORE_ADMIN: 5,
  ROLE_STORE_MANAGER: 4,
  ROLE_BRANCH_MANAGER: 3,
  ROLE_BRANCH_CASHIER: 2,
  ROLE_USER: 1,
};

// Check if user has permission to access a route
export function hasRoutePermission(
  userRole: UserRole,
  pathname: string
): boolean {
  const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];
  return allowedRoutes.some((route) => pathname.startsWith(route));
}

// Onboarding removed: store/branch absence no longer forces a special flow.

// Get default route for user role
export function getDefaultRouteForRole(role: UserRole): string {
  const roleRoutes: Record<UserRole, string> = {
    ROLE_USER: "/user/profile",
    ROLE_SUPER_ADMIN: "/admin/dashboard",
    ROLE_STORE_ADMIN: "/store/admin",
    ROLE_BRANCH_CASHIER: "/cashier/dashboard",
    ROLE_BRANCH_MANAGER: "/branch-manager",
    ROLE_STORE_MANAGER: "/store-manager",
  };

  return roleRoutes[role] || "/user/profile";
}

// Get user-friendly role name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    ROLE_USER: "User",
    ROLE_SUPER_ADMIN: "Super Admin",
    ROLE_STORE_ADMIN: "Store Admin",
    ROLE_BRANCH_CASHIER: "Cashier",
    ROLE_BRANCH_MANAGER: "Branch Manager",
    ROLE_STORE_MANAGER: "Store Manager",
  };

  return roleNames[role] || role;
}

// Check if role can create users
export function canCreateUsers(role: UserRole): boolean {
  return [
    "ROLE_SUPER_ADMIN",
    "ROLE_STORE_ADMIN",
    "ROLE_STORE_MANAGER",
    "ROLE_BRANCH_MANAGER",
  ].includes(role);
}

// Check if role can manage inventory
export function canManageInventory(role: UserRole): boolean {
  return [
    "ROLE_SUPER_ADMIN",
    "ROLE_STORE_ADMIN",
    "ROLE_STORE_MANAGER",
    "ROLE_BRANCH_MANAGER",
  ].includes(role);
}

// Check if role can view analytics
export function canViewAnalytics(role: UserRole): boolean {
  return [
    "ROLE_SUPER_ADMIN",
    "ROLE_STORE_ADMIN",
    "ROLE_STORE_MANAGER",
    "ROLE_BRANCH_MANAGER",
  ].includes(role);
}

// Check if role can process transactions
export function canProcessTransactions(role: UserRole): boolean {
  return [
    "ROLE_SUPER_ADMIN",
    "ROLE_STORE_ADMIN",
    "ROLE_STORE_MANAGER",
    "ROLE_BRANCH_MANAGER",
    "ROLE_BRANCH_CASHIER",
  ].includes(role);
}

// Validate JWT token (client-side basic validation)
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Check if JWT is expired
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}
