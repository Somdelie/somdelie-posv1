"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get JWT from cookies (server-side)
async function getJWT(): Promise<string | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");
  return jwt?.value || null;
}

export type Refund = {
  id: string;
  order?: {
    orderNumber?: string;
    id?: string;
    customer?: {
      fullName?: string;
      name?: string;
    };
  } | null;
  orderId?: string;
  customerName?: string;
  reason: string;
  amount: number;
  cashier?: {
    fullName?: string;
    id?: string;
  } | null;
  cashierName?: string;
  paymentType?: string | null;
  createdAt: string;
};

export type CreateRefundData = {
  orderId: string;
  reason: string;
  amount: number;
};

export type UpdateRefundData = {
  reason?: string;
  amount?: number;
  paymentType?: string;
};

/**
 * Get all refunds by cashier ID
 */
export async function getRefundsByCashier(
  cashierId: string
): Promise<{ success: boolean; data?: Refund[]; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `${API_URL}/api/refunds/cashier/${cashierId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to fetch refunds: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching refunds by cashier:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch refunds",
    };
  }
}

/**
 * Get all refunds by branch ID
 */
export async function getRefundsByBranch(
  branchId: string
): Promise<{ success: boolean; data?: Refund[]; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/refunds/branch/${branchId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to fetch branch refunds: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching branch refunds:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch branch refunds",
    };
  }
}

/**
 * Get refunds by cashier and date range
 */
export async function getRefundsByDateRange(
  cashierId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; data?: Refund[]; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `${API_URL}/api/refunds/cashier/${cashierId}/range?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to fetch refunds by date range: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching refunds by date range:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch refunds by date range",
    };
  }
}

/**
 * Get refund by ID
 */
export async function getRefundById(
  refundId: string
): Promise<{ success: boolean; data?: Refund; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/refunds/${refundId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to fetch refund: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching refund:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch refund",
    };
  }
}

/**
 * Create a new refund
 */
export async function createRefund(
  refundData: CreateRefundData
): Promise<{ success: boolean; data?: Refund; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/refunds`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refundData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to create refund: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error creating refund:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create refund",
    };
  }
}

/**
 * Update a refund
 */
export async function updateRefund(
  refundId: string,
  refundData: UpdateRefundData
): Promise<{ success: boolean; data?: Refund; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/refunds/${refundId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refundData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to update refund: ${response.status} ${errorText}`,
      };
    }

    // Handle non-JSON responses (204 No Content, etc.)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error("Error updating refund:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update refund",
    };
  }
}

/**
 * Delete a refund
 */
export async function deleteRefund(
  refundId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/refunds/${refundId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to delete refund: ${response.status} ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting refund:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete refund",
    };
  }
}
