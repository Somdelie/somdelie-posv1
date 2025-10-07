"use server";

import { cookies } from "next/headers";
import { getJWT } from "./auth";

export interface Store {
  id: string;
  brandName: string;
  description?: string;
  storeType: string;
  status: string;
  createdDate: string;
  updatedDate?: string;
  storeAdmin: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    storeId: string;
    branchId?: string;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
  };
}

export interface CreateStoreData {
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export async function getStoreById(storeId: string): Promise<Store | null> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch store:",
        response.status,
        response.statusText
      );
      return null;
    }

    const store = await response.json();
    console.log("Fetched store data:", store);
    return store;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
}

export async function getCurrentUserStore(): Promise<Store | null> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stores/current`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const store = await response.json();
    return store;
  } catch (error) {
    console.error("Error fetching current user store:", error);
    return null;
  }
}

export async function createStore(
  prevState: { success: boolean; store?: Store; error?: string },
  formData: FormData
): Promise<{ success: boolean; store?: Store; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const storeData: CreateStoreData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      phoneNumber: (formData.get("phoneNumber") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stores`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to create store",
      };
    }

    const store = await response.json();
    return {
      success: true,
      store,
    };
  } catch (error) {
    console.error("Error creating store:", error);
    return {
      success: false,
      error: "An error occurred while creating the store",
    };
  }
}

export async function updateStore(
  storeId: string,
  formData: FormData
): Promise<{ success: boolean; store?: Store; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const storeData: Partial<CreateStoreData> = {
      name: (formData.get("name") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      phoneNumber: (formData.get("phoneNumber") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
    };

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(storeData).filter(([_, value]) => value !== undefined)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to update store",
      };
    }

    const store = await response.json();
    return {
      success: true,
      store,
    };
  } catch (error) {
    console.error("Error updating store:", error);
    return {
      success: false,
      error: "An error occurred while updating the store",
    };
  }
}

export async function deleteStore(
  storeId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to delete store",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting store:", error);
    return {
      success: false,
      error: "An error occurred while deleting the store",
    };
  }
}
