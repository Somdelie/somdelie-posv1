"use server";
import { getJWT } from "./auth";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  brand?: string;
  image?: string;
  categoryId: string;
  storeId: string;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface CreateProductData {
  name: string;
  sku: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  brand?: string;
  image?: string;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  sku?: string;
  description?: string;
  mrp?: number;
  sellingPrice?: number;
  brand?: string;
  image?: string;
  categoryId?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getStoreProducts(storeId: string) {
  try {
    if (!storeId) return { success: false, error: "Store ID is required" };
    const jwt = await getJWT();
    if (!jwt) return { success: false, error: "Not authenticated" };
    const res = await fetch(`${baseUrl}/api/products/store/${storeId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to fetch products",
      };
    }
    const products: Product[] = await res.json();
    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products. Please try again.",
    };
  }
}

export async function createProduct(storeId: string, data: CreateProductData) {
  try {
    const jwt = await getJWT();
    if (!jwt) return { success: false, error: "Not authenticated" };
    const payload = { ...data, storeId };
    const res = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to create product",
      };
    }
    const product: Product = await res.json();
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: "Failed to create product. Please try again.",
    };
  }
}

export async function updateProduct(
  productId: string,
  data: UpdateProductData
) {
  try {
    if (!productId) return { success: false, error: "Product ID is required" };
    const jwt = await getJWT();
    if (!jwt) return { success: false, error: "Not authenticated" };
    // Clean payload
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    const res = await fetch(`${baseUrl}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(cleaned),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to update product",
      };
    }
    const product: Product = await res.json();
    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: "Failed to update product. Please try again.",
    };
  }
}
