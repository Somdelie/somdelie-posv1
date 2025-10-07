/**
 * JWT Utilities for managing authentication tokens
 */

/**
 * Set JWT token in both localStorage and cookies
 * @param jwt The JWT token string
 */
export function setJWT(jwt: string) {
  if (typeof window !== "undefined") {
    // Store in localStorage for client-side access
    localStorage.setItem("jwt", jwt);

    // Store in cookies for middleware access
    // Max age: 7 days (604800 seconds)
    document.cookie = `jwt=${jwt}; path=/; max-age=604800; SameSite=Strict`;
  }
}

/**
 * Get JWT token from localStorage (client-side)
 * @returns JWT token or null
 */
export function getJWT(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt");
  }
  return null;
}

/**
 * Clear JWT token from both localStorage and cookies
 */
export function clearJWT() {
  if (typeof window !== "undefined") {
    // Remove from localStorage
    localStorage.removeItem("jwt");

    // Clear cookie by setting expired date
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

/**
 * Parse JWT payload (client-side only, no signature verification)
 * WARNING: This does NOT verify the signature. Only use for reading claims.
 * @param jwt The JWT token string
 * @returns Decoded payload or null
 */
export function parseJWTPayload(jwt: string): any {
  try {
    const payload = jwt.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}

/**
 * Check if user needs onboarding based on role and assignments
 * @param user User object from JWT payload
 * @returns true if user needs onboarding
 */
export function needsOnboarding(user: any): boolean {
  if (!user || !user.role) return false;

  // Store admins and managers need a store
  const rolesNeedingStore = ["ROLE_STORE_ADMIN", "ROLE_STORE_MANAGER"];
  if (rolesNeedingStore.includes(user.role)) {
    return !user.storeId && !user.store;
  }

  // Branch roles need both store and branch
  const rolesNeedingBranch = ["ROLE_BRANCH_MANAGER", "ROLE_BRANCH_CASHIER"];
  if (rolesNeedingBranch.includes(user.role)) {
    return !user.branchId && !user.branch;
  }

  return false;
}
