"use server";
import { getJWT } from "./auth";
export interface Branch {
  id: string;
  name: string;
  address: string;
  storeId: string;
}

export interface Employee {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  branchId?: string;
  storeId: string;
  createdAt: string;
}

export interface CreateEmployeeData {
  email: string;
  fullName: string;
  phone: string;
  role: string;
  password: string;
  branchId?: string;
}

// Create a new employee
export async function createEmployee(
  storeId: string,
  employeeData: CreateEmployeeData
) {
  try {
    console.log("=== CREATE EMPLOYEE DEBUG ===");
    console.log("1. Function called with:");
    console.log("   storeId:", storeId);
    console.log("   employeeData:", {
      ...employeeData,
      password: "[REDACTED]",
    });

    if (!storeId) {
      console.log("ERROR: Store ID is missing!");
      return { success: false, error: "Store ID is required" };
    }

    const jwt = await getJWT();

    if (!jwt) {
      console.log("ERROR: JWT token is missing!");
      return { success: false, error: "Not authenticated" };
    }

    console.log("2. JWT token obtained successfully");

    // Clean the employee data to remove any undefined/null values
    const cleanEmployeeData: any = {
      email: employeeData.email,
      fullName: employeeData.fullName,
      phone: employeeData.phone,
      role: employeeData.role,
      password: employeeData.password,
    };

    // Only add branchId if it exists and is not empty
    if (
      employeeData.branchId &&
      typeof employeeData.branchId === "string" &&
      employeeData.branchId.trim() !== ""
    ) {
      cleanEmployeeData.branchId = employeeData.branchId;
      console.log("   Including branchId:", employeeData.branchId);
    } else {
      console.log("   Excluding branchId (undefined, null, or empty)");
    }

    console.log("3. Cleaned employee data:", {
      ...cleanEmployeeData,
      password: "[REDACTED]",
    });

    const apiUrl = `http://localhost:5000/api/employees/store/${storeId}`;
    console.log("4. Making API call to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(cleanEmployeeData),
    });

    console.log("5. API Response status:", response.status);
    console.log("6. API Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("7. ERROR Response data:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to create employee",
      };
    }

    const employee = await response.json();
    console.log("8. SUCCESS: Employee created:", employee);
    console.log("=== END CREATE EMPLOYEE DEBUG ===");
    return { success: true, employee };
  } catch (error) {
    console.error("9. EXCEPTION in createEmployee:", error);
    console.log("=== END CREATE EMPLOYEE DEBUG (ERROR) ===");
    return {
      success: false,
      error: "Failed to create employee. Please try again.",
    };
  }
}

// Get all employees for a store
export async function getStoreEmployees(storeId: string) {
  try {
    if (!storeId) {
      return { success: false, error: "Store ID is required" };
    }

    const jwt = await getJWT();

    if (!jwt) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(
      `http://localhost:5000/api/employees/store/${storeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch employees" };
    }

    const employees = await response.json();
    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return {
      success: false,
      error: "Failed to fetch employees. Please try again.",
    };
  }
}

// Get all branches for a store
export async function getStoreBranches(storeId: string) {
  try {
    if (!storeId) {
      return { success: false, error: "Store ID is required" };
    }

    const jwt = await getJWT();

    if (!jwt) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(
      `http://localhost:5000/api/branches/store/${storeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch branches" };
    }

    const branches = await response.json();
    return { success: true, branches };
  } catch (error) {
    console.error("Error fetching branches:", error);
    return {
      success: false,
      error: "Failed to fetch branches. Please try again.",
    };
  }
}

// Server action for creating employee with form data
export async function createEmployeeAction(
  storeId: string,
  formData: FormData
) {
  try {
    const employeeData = {
      email: formData.get("email") as string,
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      password: formData.get("password") as string,
      branchId: (formData.get("branchId") as string) || undefined,
    };

    return await createEmployee(storeId, employeeData);
  } catch (error) {
    console.error("Error in createEmployeeAction:", error);
    return {
      success: false,
      error: "Failed to create employee. Please try again.",
    };
  }
}
