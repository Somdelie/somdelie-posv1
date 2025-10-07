"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseJWTPayload } from "@/lib/auth/jwt-utils";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  jwt?: string;
  error?: string;
  user?: any;
  redirectPath?: string;
}

export async function loginAction(
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      success: false,
      error: "Username and password are required",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Login error response:", errorText);
      return {
        success: false,
        error:
          response.status === 401
            ? "Invalid credentials"
            : "Login failed. Please try again.",
      };
    }

    const data = await response.json();
    console.log("Login success data:", data);
    const jwt = data.jwt || data.token;

    if (jwt) {
      // Set cookie on server side
      const cookieStore = await cookies();
      cookieStore.set("jwt", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Store user data including storeId for client-side access
      if (data.user) {
        cookieStore.set("user_data", JSON.stringify(data.user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      }

      // Parse JWT to get user role for redirect
      const payload = parseJWTPayload(jwt);
      const role =
        payload.authorities || payload.role || data.user?.role || "ROLE_USER";

      console.log("JWT payload:", payload);
      console.log("Detected role:", role);
      console.log("User data role:", data.user?.role);

      // Redirect based on role and store ownership
      const userStoreId = payload.storeId || data.user?.storeId;

      const getRedirectPath = (userRole: string, hasStore: boolean) => {
        if (userRole === "ROLE_STORE_ADMIN") {
          return hasStore ? "/store/admin" : "/create-store";
        }

        const roleRedirectMap: Record<string, string> = {
          ROLE_ADMIN: "/admin/dashboard",
          ROLE_STORE_MANAGER: "/store-manager",
          ROLE_BRANCH_MANAGER: "/branch-manager",
          ROLE_CASHIER: "/store/cashier",
          ROLE_USER: "/user/profile",
        };

        return roleRedirectMap[userRole] || "/dashboard";
      };

      const redirectPath = getRedirectPath(role, Boolean(userStoreId));
      console.log("User role:", role);
      console.log("User storeId:", userStoreId);
      console.log("Redirecting to:", redirectPath);

      // Return success with redirect path instead of calling redirect directly
      return {
        success: true,
        jwt,
        user: data.user,
        redirectPath,
      };
    }

    return {
      success: true,
      jwt,
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Login failed. Please try again.",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("user_data");
  redirect("/auth/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  const userData = cookieStore.get("user_data")?.value;

  if (!jwt) {
    return null;
  }

  try {
    const payload = parseJWTPayload(jwt);
    let storedUser = null;

    // Try to parse stored user data
    if (userData) {
      try {
        storedUser = JSON.parse(userData);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }

    return {
      id: storedUser?.id || payload.userId || payload.sub,
      fullName: storedUser?.fullName,
      email: payload.email || storedUser?.email,
      phone: storedUser?.phone,
      role: payload.authorities || payload.role || storedUser?.role,
      storeId: storedUser?.storeId || payload.storeId,
      branchId: storedUser?.branchId || payload.branchId,
    };
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}

export async function getJWT(): Promise<string | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value || null;

  if (jwt) {
    try {
      const payload = parseJWTPayload(jwt);
      console.log("JWT payload being sent:", {
        userId: payload.userId || payload.sub,
        email: payload.email,
        role: payload.authorities || payload.role,
        storeId: payload.storeId,
        branchId: payload.branchId,
      });
    } catch (error) {
      console.error("Error parsing JWT for debug:", error);
    }
  }

  return jwt;
}
