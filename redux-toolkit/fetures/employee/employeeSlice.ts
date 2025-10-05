import {
  createBranchEmployee,
  createStoreEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeesByBranch,
  getEmployeesByStore,
  updateEmployee,
} from "./employeeThunk";

import { createSlice } from "@reduxjs/toolkit";

type BranchEmployee = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  password: string;
  branchId?: string;
};
type StoreEmployee = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  password: string;
  storeId?: string;
};

const initialState = {
  employees: [] as (StoreEmployee | BranchEmployee)[],
  selectedEmployee: null as StoreEmployee | BranchEmployee | null,
  loading: false,
  error: null as unknown,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle create store employee actions
    builder.addCase(createStoreEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createStoreEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.employees.push(action.payload);
    });
    builder.addCase(createStoreEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle create branch employee actions
    builder.addCase(createBranchEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBranchEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.employees.push(action.payload);
    });
    builder.addCase(createBranchEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle get employees by store actions
    builder.addCase(getEmployeesByStore.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getEmployeesByStore.fulfilled, (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    });
    builder.addCase(getEmployeesByStore.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle get employees by branch actions
    builder.addCase(getEmployeesByBranch.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getEmployeesByBranch.fulfilled, (state, action) => {
      state.loading = false;
      state.employees = action.payload;
    });
    builder.addCase(getEmployeesByBranch.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle get employee by id actions
    builder.addCase(getEmployeeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getEmployeeById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedEmployee = action.payload;
    });
    builder.addCase(getEmployeeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle update employee actions
    builder.addCase(updateEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.employees.findIndex(
        (e) => e.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    });
    builder.addCase(updateEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // Handle delete employee actions
    builder.addCase(deleteEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.employees = state.employees.filter(
        (employee) => employee.id !== action.payload.id
      );
      if (state.selectedEmployee?.id === action.payload.id) {
        state.selectedEmployee = null;
      }
    });
    builder.addCase(deleteEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default employeeSlice.reducer;
