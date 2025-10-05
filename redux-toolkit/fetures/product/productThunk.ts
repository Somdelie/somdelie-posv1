import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";
import api from "@/utils/api";

// create product
export const createProduct = createAsyncThunk(
  "product/create",
  async (productData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/products", productData, {
        headers,
      });
      console.log("Product created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating product:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to create product"
      );
    }
  }
);

// update product
type ProductUpdateData = {
  id: string;
  // add other product fields as needed, e.g. name, price, etc.
  [key: string]: any;
};

export const updateProduct = createAsyncThunk(
  "product/update",
  async (productData: ProductUpdateData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/products/${productData.id}`,
        productData,
        {
          headers,
        }
      );
      console.log("Product updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating product:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to update product"
      );
    }
  }
);

// delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/products/${productId}`, {
        headers,
      });
      console.log("Product deleted:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to delete product"
      );
    }
  }
);

// get products by store
export const getProductsByStore = createAsyncThunk(
  "product/getByStore",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/products/store/${storeId}`, {
        headers,
      });
      console.log("Products fetched by store:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching products by store:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch products by store"
      );
    }
  }
);

// get product by id
export const getProductById = createAsyncThunk(
  "product/getById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/products/${productId}`, {
        headers,
      });
      console.log("Product fetched by id:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching product by id:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch product by id"
      );
    }
  }
);

// search products
type SearchProductsPayload = {
  query: string;
  storeId: string;
};

export const searchProducts = createAsyncThunk(
  "product/search",
  async ({ query, storeId }: SearchProductsPayload, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(
        `/api/products/store/${storeId}/search?query=${query}`,
        {
          headers,
        }
      );
      console.log("Products searched:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error searching products:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to search products"
      );
    }
  }
);
