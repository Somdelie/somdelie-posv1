"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get JWT from cookies (server-side)
async function getJWT(): Promise<string | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");
  return jwt?.value || null;
}

export type OrderItem = {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  subtotal?: number;
};

export type Order = {
  id: string;
  orderNumber?: string;
  storeId: string;
  branchId?: string;
  cashierId: string;
  customerId?: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  paymentType: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

export type CreateOrderData = {
  storeId: string;
  branchId?: string;
  customer?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  } | null;
  customerId?: string; // Deprecated: Use customer object instead
  customerName?: string; // Deprecated: Use customer.fullName instead
  items: {
    productId: string;
    quantity: number;
    price?: number; // Optional since backend may calculate from product
  }[];
  subtotal?: number; // Optional: Backend may calculate
  tax?: number;
  discount?: number;
  total?: number; // Optional: Backend may calculate
  paymentMethod?: string; // Keep for display purposes
  paymentType: string; // Required: Maps to backend PaymentType enum (CASH, CARD, UPI)
};

/**
 * Create a new order (complete sale)
 */
export async function createOrder(
  orderData: CreateOrderData
): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to create order: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

/**
 * Get orders by cashier ID
 */
export async function getOrdersByCashier(
  cashierId: string
): Promise<{ success: boolean; data?: Order[]; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/orders/cashier/${cashierId}`, {
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
        error: `Failed to fetch orders: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    console.log("Fetched orders by cashier:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching orders by cashier:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(
  orderId: string
): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
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
        error: `Failed to fetch order: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

/**
 * Get orders by store ID
 * ⚠️ NOTE: This endpoint does NOT exist on the backend
 * Backend endpoints available:
 * - GET /api/orders/cashier/{cashierId}
 * Use getOrdersByCashier() instead
 */
/* 
export async function getOrdersByStore(
  storeId: string
): Promise<{ success: boolean; data?: Order[]; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/orders/store/${storeId}`, {
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
        error: `Failed to fetch store orders: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching store orders:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch store orders",
    };
  }
}
*/

/**
 * Get orders by date range
 */
export async function getOrdersByDateRange(
  cashierId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; data?: Order[]; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(
      `${API_URL}/api/orders/cashier/${cashierId}/range?startDate=${startDate}&endDate=${endDate}`,
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
        error: `Failed to fetch orders by date range: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching orders by date range:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch orders by date range",
    };
  }
}
