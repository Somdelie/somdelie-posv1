import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// Thunk to start a shift
export const startShift = createAsyncThunk(
  "/shifts/startShift",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post(
        `/api/shift-reports/start?branchId=${branchId}`,
        { headers },
        {
          // Add any additional data you need to send with the request
        }
      );
      console.log("Shift started successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to start shift"
      );
    }
  }
);

// Thunk to end a shift
export const endShift = createAsyncThunk(
  "/shifts/endShift",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.patch(
        `/api/shift-reports/end`,
        { headers },
        {
          // Add any additional data you need to send with the request
        }
      );
      console.log("Shift ended successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to end shift"
      );
    }
  }
);

// Thunk to fetch the current shift progress
export const getCurrentShiftProgress = createAsyncThunk(
  "/shifts/getCurrentShiftProgress",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/shift-reports/current?branchId`, {
        headers,
      });
      console.log("Shift progress fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch shift progress"
      );
    }
  }
);

// thunk to get shift report by date
export const getShiftReportByDate = createAsyncThunk(
  "/shifts/getShiftReportByDate",
  async (
    { cashierId, date }: { cashierId: string; date: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const formatedDate = encodeURIComponent(date);
      const response = await api.get(
        `/api/shift-reports/cashier/${cashierId}/by-date?date=${formatedDate}`,
        {
          headers,
        }
      );
      console.log("Shift report by date fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch shift report"
      );
    }
  }
);

// thunk to get shift by cashier
export const getShiftByCashier = createAsyncThunk(
  "/shifts/getShiftByCashier",
  async (cashierId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(
        `/api/shift-reports/cashier/${cashierId}`,
        {
          headers,
        }
      );
      console.log("Shift by cashier fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch shift by cashier"
      );
    }
  }
);

// thunk to get all shifts by branch
export const getAllShiftsByBranch = createAsyncThunk(
  "/shifts/getAllShiftsByBranch",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/shift-reports/branch/${branchId}`, {
        headers,
      });
      console.log("All shifts by branch fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch all shifts by branch"
      );
    }
  }
);

// thunk to get shift by id
export const getShiftById = createAsyncThunk(
  "/shifts/getShiftById",
  async (shiftId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/shift-reports/${shiftId}`, {
        headers,
      });
      console.log("Shift by id fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch shift by id"
      );
    }
  }
);
