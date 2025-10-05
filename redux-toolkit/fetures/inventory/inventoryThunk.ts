import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// {
//  "productId":"308e14bc-3d0a-409c-b4c0-8f06d45a2ca6",
//  "branchId":"423aa7c5-3d11-4824-95d1-8af26b525ee4",
//  "quantity": 100
// }

// create inventory
export const createInventory = createAsyncThunk(
  "inventory/create",
  async (inventoryData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/inventories", inventoryData, {
        headers,
      });
      console.log("Inventory created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating inventory:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// update inventory
export const updateInventory = createAsyncThunk(
  "inventory/update",
  async (inventoryData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/inventories/${inventoryData.id}`,
        inventoryData,
        {
          headers,
        }
      );
      console.log("Inventory updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating inventory:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
// delete inventory
export const deleteInventory = createAsyncThunk(
  "inventory/delete",
  async (inventoryId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/inventories/${inventoryId}`, {
        headers,
      });
      console.log("Inventory deleted successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting inventory:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
// fetch all inventories for a branch
export const getInventoriesByBranch = createAsyncThunk(
  "inventory/getByBranch",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/inventories/branch/${branchId}`, {
        headers,
      });
      console.log("Fetched inventories by branch successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching inventories by branch:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// get inventories by branch & product
export const getInventoriesByBranchAndProduct = createAsyncThunk(
  "inventory/getByBranchAndProduct",
  async (
    payload: { branchId: string; productId: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(
        `/api/inventories/branch/${payload.branchId}/product/${payload.productId}`,
        {
          headers,
        }
      );
      console.log(
        "Fetched inventories by branch and product successfully:",
        response.data
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching inventories by branch and product:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// fetch inventory by id
export const getInventoryById = createAsyncThunk(
  "inventory/getById",
  async (inventoryId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/inventories/${inventoryId}`, {
        headers,
      });
      console.log("Fetched inventory successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
