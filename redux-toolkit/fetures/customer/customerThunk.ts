import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

// thunk to get create customer
export const creatCustomer = createAsyncThunk(
  "/user/createCustomer",
  async (customer: any, { rejectWithValue }) => {
    try {
      console.log(customer, "customer data in thunk");
      const headers = getAuthHeaders();
      const response = await api.post(`/api/customers`, customer, { headers });
      const data = response.data;
      console.log(data, "created customer successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Creating Customer Failed!"
      );
    }
  }
);

// thunk to update customer
interface UpdateCustomerPayload {
  customerId: string;
  customerData: any;
}

export const updateCustomer = createAsyncThunk(
  "/user/updateCustomer",
  async (
    { customerId, customerData }: UpdateCustomerPayload,
    { rejectWithValue }
  ) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/customers/${customerId}`,
        customerData,
        { headers }
      );
      const data = response.data;
      console.log(data, "updated customer successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Updating Customer Failed!"
      );
    }
  }
);

// thunk to delete customer
export const deleteCustomer = createAsyncThunk(
  "/user/deleteCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/customers/${customerId}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "deleted customer successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Deleting Customer Failed!"
      );
    }
  }
);

// thunk to get customer by id
export const getCustomerById = createAsyncThunk(
  "/user/getCustomerById",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/customers/${customerId}`, {
        headers,
      });
      const data = response.data;
      console.log(data, "fetched customer successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Customer Failed!"
      );
    }
  }
);

// thunk to get all customers
export const getCustomers = createAsyncThunk(
  "/user/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/customers`, { headers });
      const data = response.data;
      console.log(data, "fetched all customers successfully");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Customers Failed!"
      );
    }
  }
);
