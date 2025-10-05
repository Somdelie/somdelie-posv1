import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// create store
export const createStore = createAsyncThunk(
  "store/create",
  async (storeData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/stores", storeData, { headers });
      console.log("Store created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating store:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// update store
export const updateStore = createAsyncThunk(
  "store/update",
  async (storeData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(`/api/stores/${storeData.id}`, storeData, {
        headers,
      });
      console.log("Store updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating store:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// delete store
export const deleteStore = createAsyncThunk(
  "store/delete",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/stores/${storeId}`, { headers });
      console.log("Store deleted successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting store:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// fetch all stores
export const getStores = createAsyncThunk(
  "store/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get("/api/stores", { headers });
      console.log("Fetched stores successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching stores:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// fetch store by id
export const getStoreById = createAsyncThunk(
  "store/getById",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/stores/${storeId}`, { headers });
      console.log("Fetched store successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching store:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// get store by admin
export const getStoreByAdmin = createAsyncThunk(
  "store/getByAdmin",
  async (adminId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/stores/admin/${adminId}`, {
        headers,
      });
      console.log("Fetched stores by admin successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching stores by admin:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// get store by employee
export const getStoreByEmployee = createAsyncThunk(
  "store/getByEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/stores/employee/${employeeId}`, {
        headers,
      });
      console.log("Fetched stores by employee successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching stores by employee:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// moderate store (activate/deactivate)
export const moderateStore = createAsyncThunk(
  "store/moderate",
  async (payload: { storeId: string; action: string }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/stores/moderate/${payload.storeId}`,
        {},
        {
          headers,
          params: { action: payload.action },
        }
      );
      console.log("Store moderated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error moderating store:", error);
      return rejectWithValue(error.response.data);
    }
  }
);
