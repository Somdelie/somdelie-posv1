import { createSlice } from "@reduxjs/toolkit";
import {
  creatCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "./customerThunk";

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdDate?: string | null;
  modifiedDate?: string | null;
};

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: unknown;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add cases for customer-related thunks here
    // Handle create customer actions
    builder.addCase(creatCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(creatCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.customers.push(action.payload);
    });
    builder.addCase(creatCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle update customer actions
    builder.addCase(updateCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.customers.findIndex(
        (c: any) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      if (
        state.selectedCustomer &&
        state.selectedCustomer.id === action.payload.id
      ) {
        state.selectedCustomer = action.payload;
      }
    });
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle delete customer actions
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload.id
      );
      if (
        state.selectedCustomer &&
        state.selectedCustomer.id === action.payload.id
      ) {
        state.selectedCustomer = null;
      }
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // handle get all customers
    builder.addCase(getCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.customers = [];
    });
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload;
    });
    builder.addCase(getCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as unknown;
    });
  },
});

export default customerSlice.reducer;
