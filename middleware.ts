import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple role-based route permissions
const roleRoutePermissions: Record<string, string[]> = {
  ROLE_USER: ["/user"],
  ROLE_SUPER_ADMIN: [
    "/admin",
    "/store",
    "/branch-manager",
    "/store-manager",
    "/cashier",
    "/user",
  ],
  ROLE_STORE_ADMIN: [
    "/store",
    "/branch-manager",
    "/store-manager",
    "/cashier",
    "/user",
  ],
  ROLE_STORE_MANAGER: [
    "/store-manager",
    "/store",
    "/branch-manager",
    "/cashier",
    "/user",
  ],
  ROLE_BRANCH_MANAGER: ["/branch-manager", "/store", "/cashier", "/user"],
  ROLE_BRANCH_CASHIER: ["/cashier", "/store", "/user"],
  ROLE_CASHIER: ["/cashier", "/store", "/user"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth",
  "/create-store",
  "/theme-selector",
  "/test-jwt",
  "/api",
  "/_next",
  "/favicon.ico",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function hasRoutePermission(userRole: string, pathname: string): boolean {
  if (!userRole) return false;

  const allowedPrefixes = roleRoutePermissions[userRole] || [];

  // Check if user has permission for this route prefix
  return allowedPrefixes.some(
    (prefix) => pathname.startsWith(prefix + "/") || pathname === prefix
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get JWT from cookies
  const jwt = request.cookies.get("jwt")?.value;

  // If no JWT and trying to access protected route, redirect to login
  if (!jwt) {
    // Avoid redirect loops - don't redirect if already on auth pages
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Parse JWT and check permissions
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64").toString()
    );

    const userRole = payload.authorities || payload.role;
    let userStoreId = payload.storeId;

    // Also check for storeId in user_data cookie if not in JWT
    if (!userStoreId) {
      const userData = request.cookies.get("user_data")?.value;
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          userStoreId = parsedUserData.storeId;
        } catch (e) {
          console.error("Error parsing user_data cookie:", e);
        }
      }
    }

    console.log("Middleware Debug - JWT Payload:", payload);
    console.log("Middleware Debug - User Role:", userRole);
    console.log("Middleware Debug - User StoreId (from JWT):", payload.storeId);
    console.log("Middleware Debug - User StoreId (final):", userStoreId);
    console.log("Middleware Debug - Pathname:", pathname);

    // If no role found, redirect to login
    if (!userRole) {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("jwt");
      return response;
    }

    // TEMPORARY FIX: Since JWT doesn't contain storeId, we'll allow ROLE_STORE_ADMIN access
    // TODO: Backend should include storeId in JWT payload for proper validation
    console.log(
      "Middleware Debug - Is ROLE_STORE_ADMIN:",
      userRole === "ROLE_STORE_ADMIN"
    );
    console.log("Middleware Debug - Has StoreId:", Boolean(userStoreId));

    // For now, allow all ROLE_STORE_ADMIN users to access store routes
    // The proper fix would be to include storeId in JWT payload from backend
    if (userRole === "ROLE_STORE_ADMIN" && !userStoreId) {
      console.log(
        "Middleware Debug - ROLE_STORE_ADMIN without storeId in JWT - allowing access (temporary fix)"
      );
      // Don't restrict access since storeId is not in JWT payload
      // return NextResponse.next();
    }

    // Check if user has permission for this route
    if (!hasRoutePermission(userRole, pathname)) {
      // Store-based default routes
      const defaultRoutes: Record<string, string> = {
        ROLE_SUPER_ADMIN: "/admin/dashboard",
        ROLE_STORE_ADMIN: userStoreId ? "/store/admin" : "/create-store",
        ROLE_STORE_MANAGER: "/store-manager",
        ROLE_BRANCH_MANAGER: "/branch-manager",
        ROLE_CASHIER: "/cashier/dashboard",
        ROLE_USER: "/user/profile",
      };

      const defaultRoute = defaultRoutes[userRole] || "/";

      // Only redirect if we're not already on their default route or a valid route
      if (
        pathname !== defaultRoute &&
        !hasRoutePermission(userRole, pathname)
      ) {
        return NextResponse.redirect(new URL(defaultRoute, request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid JWT - clear cookie and redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("jwt");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
