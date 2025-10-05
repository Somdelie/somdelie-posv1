import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// thunk to create a refund
export const createRefund = createAsyncThunk(
  "/refunds/createRefund",
  async (refundData: any, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post("/api/refunds", refundData, { headers });
      console.log(response.data, "refund created successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data, "error response data");
      return rejectWithValue(
        error.response?.data?.message || "Failed to create refund"
      );
    }
  }
);

// thunk to get refunds by order ID
export const getRefundsByOrderId = createAsyncThunk(
  "/refunds/getRefundsByOrderId",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/refunds/order/${orderId}`, {
        headers,
      });
      console.log(response.data, "refunds fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message, "error response data");
      return rejectWithValue(
        error.response?.data?.message || "Fetching Refunds Failed!"
      );
    }
  }
);

// thunk to get all refunds
export const getAllRefunds = createAsyncThunk(
  "/refunds/getAllRefunds",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get("/api/refunds", { headers });
      console.log(response.data, "all refunds fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message, "error response data");
      return rejectWithValue(
        error.response?.data?.message || "Fetching All Refunds Failed!"
      );
    }
  }
);

// thunk to get refunds by cashier
export const getRefundsByCashier = createAsyncThunk(
  "/refunds/getRefundsByCashier",
  async (cashierId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/refunds/cashier/${cashierId}`, {
        headers,
      });
      console.log(response.data, "refunds fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message, "error response data");
      return rejectWithValue(
        error.response?.data?.message || "Fetching Refunds Failed!"
      );
    }
  }
);

// thunk to get refunds by branch
export const getRefundsByBranch = createAsyncThunk(
  "/refunds/getRefundsByBranch",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/refunds/branch/${branchId}`, {
        headers,
      });
      console.log(response.data, "refunds fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response?.data?.message, "error response data");
      return rejectWithValue(
        error.response?.data?.message || "Fetching Refunds Failed!"
      );
    }
  }
);

// thunk to get refunds by shift
export const getRefundsByShift = createAsyncThunk(
  "/refunds/getRefundsByShift",
  async (shiftId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/refunds/shift/${shiftId}`, {
        headers,
      });
      console.log(response.data, "refunds fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response.data.message, "error response data");
      return rejectWithValue(
        error.response.data.message || "Fetching Refunds Failed!"
      );
    }
  }
);

// thunk to get refunds by cashier and date range
export const getRefundsByCashierAndDate = createAsyncThunk(
  "/refunds/getRefundsByCashierAndDate",
  async (
    {
      cashierId,
      startDate,
      endDate,
    }: { cashierId: string; startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const formattedStartDate = encodeURIComponent(startDate);
      const formattedEndDate = encodeURIComponent(endDate);
      const response = await api.get(
        `/refunds/cashier/${cashierId}/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers,
        }
      );
      console.log(response.data, "refunds fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response.data.message, "error response data");
      return rejectWithValue(
        error.response.data.message || "Fetching Refunds Failed!"
      );
    }
  }
);

// thunk to refund by id
export const getRefundById = createAsyncThunk(
  "/refunds/getRefundById",
  async (refundId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/refunds/${refundId}`, {
        headers,
      });
      console.log(response.data, "refund fetched successfully");
      return response.data;
    } catch (error: any) {
      console.log(error.response.data.message, "error response data");
      return rejectWithValue(
        error.response.data.message || "Fetching Refund Failed!"
      );
    }
  }
);
