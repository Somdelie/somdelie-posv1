import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRoutePermissions: Record<string, string[]> = {
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

// Public routes (no login needed)
const publicRoutes = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/reset-password",
  "/theme-selector",
  "/test-jwt",
  "/create-store",
];

// Semi-public routes (login required, any role allowed)
const semiPublicRoutes = ["/store/create"];

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function isSemiPublicRoute(pathname: string): boolean {
  return semiPublicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function hasPermission(userRole: string, pathname: string): boolean {
  const allowedRoutes = roleRoutePermissions[userRole] || [];
  return allowedRoutes.some((route) => pathname.startsWith(route));
}

// Onboarding removed: no special pre-dashboard flow now.

export function middleware(request: NextRequest) {
  let { pathname } = request.nextUrl;
  if (pathname.length > 1 && pathname.endsWith("/"))
    pathname = pathname.slice(0, -1);

  // Allow all public routes
  if (isPublicRoute(pathname)) return NextResponse.next();

  // Check for JWT
  const jwt = request.cookies.get("jwt")?.value;

  const protectedPrefixes = [
    "/store",
    "/admin",
    "/cashier",
    "/branch-manager",
    "/store-manager",
    "/user",
  ];

  const isProtectedPrefix = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // Require login for protected routes
  if (!jwt && (isProtectedPrefix || !isPublicRoute(pathname))) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Decode JWT if present
  if (jwt) {
    try {
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString()
      );
      const userRole = payload.role;
      const user = payload;

      // Transitional bridge: promote context from temporary cookie if backend-reissued JWT not yet present.
      const tempStoreId = request.cookies.get("storeCtx")?.value;
      const responseHeaders: Record<string, string> = {};

      if (tempStoreId && !user.storeId) {
        user.storeId = tempStoreId;
        if (user.role === "ROLE_USER") {
          user.role = "ROLE_STORE_ADMIN";
        }
      } else if (tempStoreId && user.storeId) {
        // Cleanup: JWT now authoritative, expire transitional cookie
        responseHeaders[
          "set-cookie"
        ] = `storeCtx=; Path=/; Max-Age=0; SameSite=Strict`;
      }

      // Elevate ROLE_USER to ROLE_STORE_ADMIN if a storeId exists (temporary bridge)
      if (user.role === "ROLE_USER" && (user.storeId || user.store)) {
        user.role = "ROLE_STORE_ADMIN";
      }

      if (!userRole) {
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
      }

      // ✅ Allow semi-public routes for all logged-in users
      if (isSemiPublicRoute(pathname)) {
        return NextResponse.next();
      }

      // Onboarding flow removed: skip related redirects.

      // 🔒 Role-based route permission
      if (!hasPermission(userRole, pathname)) {
        const notFoundUrl = new URL("/not-found", request.url);
        const res = NextResponse.redirect(notFoundUrl);
        if (responseHeaders["set-cookie"]) {
          res.headers.append("set-cookie", responseHeaders["set-cookie"]);
        }
        return res;
      }

      const res = NextResponse.next();
      if (responseHeaders["set-cookie"]) {
        res.headers.append("set-cookie", responseHeaders["set-cookie"]);
      }
      return res;
    } catch (error) {
      const loginUrl = new URL("/auth/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("jwt");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
