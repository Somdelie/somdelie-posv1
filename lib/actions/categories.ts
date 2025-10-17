"use server";
import { getJWT } from "./auth";

export interface Category {
  id: string;
  name: string;
  storeId: string;
}

export interface CreateCategoryData {
  name: string;
}

export interface UpdateCategoryData {
  name?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getStoreCategories(storeId: string) {
  try {
    if (!storeId) return { success: false, error: "Store ID is required" };

    const jwt = await getJWT();
    if (!jwt) return { success: false, error: "Not authenticated" };

    const res = await fetch(`${baseUrl}/api/categories/store/${storeId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to fetch categories",
      };
    }

    const categories: Category[] = await res.json();
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories. Please try again.",
    };
  }
}

export async function createCategory(
  storeId: string,
  data: CreateCategoryData
) {
  try {
    if (!storeId) return { success: false, error: "Store ID is required" };
    if (!data?.name?.trim())
      return { success: false, error: "Name is required" };

    const jwt = await getJWT();
    if (!jwt) return { success: false, error: "Not authenticated" };

    const res = await fetch(`${baseUrl}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ storeId, name: data.name.trim() }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to create category",
      };
    }

    const category: Category = await res.json();
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: "Failed to create category. Please try again.",
    };
  }
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryData
) {
  try {
    if (!categoryId)
      return { success: false, error: "Category ID is required" };
    if (!data || !data.name || !data.name.trim()) {
      return { success: false, error: "Name is required" };
    }

    const jwt = await getJWT();
    if (!jwt) return { success: false, error: "Not authenticated" };

    const res = await fetch(`${baseUrl}/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ name: data.name.trim() }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to update category",
      };
    }

    const category: Category = await res.json();
    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: "Failed to update category. Please try again.",
    };
  }
}
