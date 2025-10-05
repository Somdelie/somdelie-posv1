import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// Async thunk to create a new branch
export const createBranch = createAsyncThunk(
  "branch/createBranch",
  async (branchData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/branches", branchData, { headers });
      console.log("Branch created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating branch:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to create branch"
      );
    }
  }
);

// Async thunk to get all branches by store
export const getBranchesByStore = createAsyncThunk(
  "branch/getBranchesByStore",
  async (storeId: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/branches/store/${storeId}`, {
        headers,
      });
      console.log("Branches fetched for store:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching branches for store:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch branches for store"
      );
    }
  }
);

// Async thunk to delete a branch
export const deleteBranch = createAsyncThunk(
  "branch/deleteBranch",
  async (branchId: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/branches/${branchId}`, {
        headers,
      });
      console.log("Branch deleted:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting branch:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to delete branch"
      );
    }
  }
);

// Async thunk to get a single branch by ID
export const getBranchById = createAsyncThunk(
  "branch/getBranchById",
  async (branchId: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/branches/${branchId}`, { headers });
      console.log("Branch fetched:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching branch:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch branch"
      );
    }
  }
);

// Async thunk to update a branch
export const updateBranch = createAsyncThunk(
  "branch/updateBranch",
  async (branchData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/branches/${branchData.id}`,
        branchData,
        { headers }
      );
      console.log("Branch updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating branch:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to update branch"
      );
    }
  }
);
