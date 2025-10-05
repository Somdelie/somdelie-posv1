import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../auth/getAuthHeader";

type StoreEmployee = {
  email: string;
  fullName: string;
  phone: string;
  role: string;
  password: string;
  storeId?: string;
  // add other fields as needed
};

type BranchEmployee = {
  email: string;
  fullName: string;
  phone: string;
  role: string;
  password: string;
  branchId?: string;
};

interface CreateEmployeePayload {
  employeeData: StoreEmployee; // Replace 'any' with your employee data type if available
  storeId: string;
}

export const createStoreEmployee = createAsyncThunk<
  any, // Replace with the return type if known
  CreateEmployeePayload
>("employee/create", async ({ employeeData, storeId }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.post(
      `/api/employees/store/${storeId}`,
      employeeData,
      {
        headers,
      }
    );
    console.log("Employee created:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return rejectWithValue(
      error.response.data.message || "Failed to create employee"
    );
  }
});

// create branch employee
interface CreateBranchEmployeePayload {
  employeeData: BranchEmployee; // Replace 'any' with your employee data type if available
  branchId: string;
}

export const createBranchEmployee = createAsyncThunk<
  any, // Replace with the return type if known
  CreateBranchEmployeePayload
>(
  "employee/createBranch",
  async ({ employeeData, branchId }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.post(
        `/api/employees/branch/${branchId}`,
        employeeData,
        {
          headers,
        }
      );
      console.log("Branch employee created:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating branch employee:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to create branch employee"
      );
    }
  }
);

// update employee
type EmployeeUpdateData = {
  id: string;
  // add other employee fields as needed, e.g. name, role, etc.
  [key: string]: any;
};
export const updateEmployee = createAsyncThunk(
  "employee/update",
  async (employeeData: EmployeeUpdateData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.put(
        `/api/employees/${employeeData.id}`,
        employeeData,
        {
          headers,
        }
      );
      console.log("Employee updated:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating employee:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to update employee"
      );
    }
  }
);

// delete employee
export const deleteEmployee = createAsyncThunk(
  "employee/delete",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.delete(`/api/employees/${employeeId}`, {
        headers,
      });
      console.log("Employee deleted:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to delete employee"
      );
    }
  }
);

// fetch employees by store
export const getEmployeesByStore = createAsyncThunk(
  "employee/getByStore",
  async (storeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/employees/store/${storeId}`, {
        headers,
      });
      console.log("Employees fetched by store:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching employees by store:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch employees by store"
      );
    }
  }
);

// fetch employees by branch
export const getEmployeesByBranch = createAsyncThunk(
  "employee/getByBranch",
  async (branchId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/employees/branch/${branchId}`, {
        headers,
      });
      console.log("Employees fetched by branch:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching employees by branch:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch employees by branch"
      );
    }
  }
);

// fetch employee by id
export const getEmployeeById = createAsyncThunk(
  "employee/getById",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await api.get(`/api/employees/${employeeId}`, {
        headers,
      });
      console.log("Employee fetched by id:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching employee by id:", error);
      return rejectWithValue(
        error.response.data.message || "Failed to fetch employee by id"
      );
    }
  }
);
