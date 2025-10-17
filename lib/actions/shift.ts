"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get JWT from cookies (server-side)
async function getJWT(): Promise<string | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");
  return jwt?.value || null;
}

export interface ShiftReport {
  id: string;
  shiftStart: string;
  shiftEnd: string | null;
  totalSales: number | null;
  totalRefunds: number | null;
  netSale: number | null;
  totalOrders: number | null;
  cashier: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    branchId: string;
    storeId: string;
    lastLogin: string;
  };
  cashierId: string;
  branch: any | null;
  branchId: string;
  paymentSummaries: any[] | null;
  topSellProducts: any[];
  recentOrders: any[];
  refunds: any[];
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Start a new shift for the logged-in cashier
 * Uses JWT token to identify the cashier
 */
export async function startShift(): Promise<ActionResponse<ShiftReport>> {
  try {
    const token = await getJWT();

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/api/shift-reports/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message || `Failed to start shift: ${response.statusText}`,
      };
    }

    const data: ShiftReport = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error starting shift:", error);
    return {
      success: false,
      error: "An error occurred while starting shift. Please try again.",
    };
  }
}

/**
 * End the current shift for the logged-in cashier
 * Uses JWT token to identify the cashier
 */
export async function endShift(): Promise<ActionResponse<ShiftReport>> {
  try {
    const token = await getJWT();

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/api/shift-reports/end`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.message || `Failed to end shift: ${response.statusText}`,
      };
    }

    const data: ShiftReport = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error ending shift:", error);
    return {
      success: false,
      error: "An error occurred while ending shift. Please try again.",
    };
  }
}

/**
 * Get the current active shift for the logged-in cashier
 * Uses JWT token to identify the cashier
 */
export async function getCurrentShift(): Promise<ActionResponse<ShiftReport>> {
  try {
    const token = await getJWT();

    if (!token) {
      return {
        success: false,
        error: "Authentication required. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/api/shift-reports/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // No active shift is not an error, it's a valid state
      if (response.status === 404) {
        return {
          success: true,
          data: undefined,
        };
      }

      return {
        success: false,
        error:
          errorData.message ||
          `Failed to get current shift: ${response.statusText}`,
      };
    }

    const data: ShiftReport = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error getting current shift:", error);
    return {
      success: false,
      error: "An error occurred while fetching shift data. Please try again.",
    };
  }
}
