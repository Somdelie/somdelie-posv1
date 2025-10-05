import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// create category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (
    categoryData: { name: string; storeId?: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/categories", categoryData, {
        headers,
      });
      console.log("Category created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating category:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to create category"
      );
    }
  }
);

// get categories by store
export const getCategoriesByStore = createAsyncThunk(
  "category/getCategoriesByStore",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/categories/store/${storeId}`, {
        headers,
      });
      console.log("Categories fetched:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch categories"
      );
    }
  }
);

// update category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    categoryData: { id: string; name: string; storeId?: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/categories/${categoryData.id}`,
        categoryData,
        {
          headers,
        }
      );
      console.log("Category updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating category:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to update category"
      );
    }
  }
);

// delete category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/categories/${categoryId}`, {
        headers,
      });
      console.log("Category deleted:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to delete category"
      );
    }
  }
);

// get single category
export const getCategoryById = createAsyncThunk(
  "category/getCategoryById",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/categories/${categoryId}`, {
        headers,
      });
      console.log("Category fetched:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching category:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch category"
      );
    }
  }
);
