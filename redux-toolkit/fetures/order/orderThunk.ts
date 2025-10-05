import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";
import api from "@/utils/api";

// thunk to get create order
export const createOrder = createAsyncThunk(
  "/orders/createCustomer",
  async (order, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post(`/api/orders`, order, { headers });
      const data = response.data;
      console.log(data, "created order successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Creating Order Failed!"
      );
    }
  }
);

// thunk to update order
interface UpdateOrderPayload {
  orderId: string;
  orderData: any;
}

export const updateOrder = createAsyncThunk(
  "/orders/updateOrder",
  async ({ orderId, orderData }: UpdateOrderPayload, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(`/api/orders/${orderId}`, orderData, {
        headers,
      });
      const data = response.data;
      console.log(data, "updated order successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Updating Order Failed!"
      );
    }
  }
);
// thunk to delete order
export const deleteOrder = createAsyncThunk(
  "/orders/deleteOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/orders/${orderId}`, { headers });
      const data = response.data;
      console.log(data, "deleted order successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Deleting Order Failed!"
      );
    }
  }
);
// thunk to get all orders
export const getAllOrders = createAsyncThunk(
  "/orders/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/orders`, { headers });
      const data = response.data;
      console.log(data, "fetched orders successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Orders Failed!"
      );
    }
  }
);
// thunk to get order by id
export const getOrderById = createAsyncThunk(
  "/orders/getOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/orders/${orderId}`, { headers });
      const data = response.data;
      console.log(data, "fetched order successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Order Failed!"
      );
    }
  }
);

// get orders by branch
interface GetOrdersByBranchPayload {
  branchId: string;
  customerId?: string;
  cashierId?: string;
  paymentType?: string;
  status?: string;
}

export const getOrdersByBranch = createAsyncThunk(
  "/orders/getOrdersByBranch",
  async (
    {
      branchId,
      customerId,
      cashierId,
      paymentType,
      status,
    }: GetOrdersByBranchPayload,
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const params = [];
      if (customerId) params.push(`customerId=${customerId}`);
      if (cashierId) params.push(`cashierId=${cashierId}`);
      if (paymentType) params.push(`paymentType=${paymentType}`);
      if (status) params.push(`status=${status}`);

      const query = params.length ? `?${params.join("&")}` : "";
      console.log(query, "query params");

      const response = await api.get(`/api/orders/branch/${branchId}${query}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "fetched orders by branch successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Orders by Branch Failed!"
      );
    }
  }
);

// get orders by cashier
export const getOrdersByCashier = createAsyncThunk(
  "/orders/getOrdersByCashier",
  async (cashierId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/orders/cashier/${cashierId}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "fetched orders by cashier successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Orders by Cashier Failed!"
      );
    }
  }
);

// get today's orders
export const getTodaysOrdersByBranch = createAsyncThunk(
  "/orders/getTodaysOrders",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/orders/today/branch/${branchId}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "fetched today's orders successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Today's Orders Failed!"
      );
    }
  }
);

// get order by customer
export const getOrdersByCustomer = createAsyncThunk(
  "/orders/getOrdersByCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/orders/customer/${customerId}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "fetched orders by customer successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Orders by Customer Failed!"
      );
    }
  }
);

// get recent orders by branch
export const getRecentOrdersByBranch = createAsyncThunk(
  "/orders/getRecentOrdersByBranch",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/orders/recent/branch/${branchId}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "fetched recent orders by branch successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Recent Orders by Branch Failed!"
      );
    }
  }
);

// get today's sales summary
export const getTodaysSalesSummary = createAsyncThunk(
  "/orders/getTodaysSalesSummary",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(
        `/api/orders/today/sales/branch/${branchId}`,
        {
          headers,
        }
      );
      const data = response.data;
      console.log(data, "fetched today's sales summary successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Today's Sales Summary Failed!"
      );
    }
  }
);
// get total sales summary
export const getTotalSalesSummary = createAsyncThunk(
  "/orders/getTotalSalesSummary",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(
        `/api/orders/total/sales/branch/${branchId}`,
        {
          headers,
        }
      );
      const data = response.data;
      console.log(data, "fetched total sales summary successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching Total Sales Summary Failed!"
      );
    }
  }
);
