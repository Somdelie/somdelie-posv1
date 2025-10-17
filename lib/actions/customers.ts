"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Get JWT from cookies (server-side)
async function getJWT(): Promise<string | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");
  return jwt?.value || null;
}

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCustomerData = {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
};

export type UpdateCustomerData = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
};

/**
 * Get all customers
 */
export async function getCustomers(): Promise<{
  success: boolean;
  data?: Customer[];
  error?: string;
}> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/customers`, {
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
        error: `Failed to fetch customers: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    console.log("Fetched customers:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch customers",
    };
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(
  customerId: string
): Promise<{ success: boolean; data?: Customer; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
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
        error: `Failed to fetch customer: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch customer",
    };
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(
  customerData: CreateCustomerData
): Promise<{ success: boolean; data?: Customer; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to create customer: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error creating customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create customer",
    };
  }
}

/**
 * Update a customer
 */
export async function updateCustomer(
  customerId: string,
  customerData: UpdateCustomerData
): Promise<{ success: boolean; data?: Customer; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to update customer: ${response.status} ${errorText}`,
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
    console.error("Error updating customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update customer",
    };
  }
}

/**
 * Delete a customer
 */
export async function deleteCustomer(
  customerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Authentication required" };
    }

    const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
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
        error: `Failed to delete customer: ${response.status} ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete customer",
    };
  }
}
