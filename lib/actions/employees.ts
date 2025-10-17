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

export interface UpdateEmployeeData {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: string;
  password?: string;
  branchId?: string | null;
}

// Get employees for a specific branch
export async function getBranchEmployees(branchId: string) {
  try {
    if (!branchId) {
      return { success: false, error: "Branch ID is required" };
    }

    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Not authenticated" };
    }

    const response = await fetch(
      `http://localhost:5000/api/employees/branch/${branchId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        error: err.message || "Failed to fetch branch employees",
      };
    }

    const employees = await response.json();
    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching branch employees:", error);
    return {
      success: false,
      error: "Failed to fetch branch employees. Please try again.",
    };
  }
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

// Get a single employee by ID (used to merge payloads for updates)
export async function getEmployeeById(employeeId: string) {
  try {
    if (!employeeId) {
      return { success: false, error: "Employee ID is required" };
    }

    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Not authenticated" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/employees/${employeeId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let msg = "Failed to fetch employee";
      try {
        const err = await res.json();
        msg = err.message || msg;
      } catch {}
      return { success: false, error: msg };
    }

    const employee: Employee = await res.json();
    return { success: true, employee };
  } catch (error) {
    console.error("Error fetching employee:", error);
    return {
      success: false,
      error: "Failed to fetch employee. Please try again.",
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

// Update an employee (role, branchId, etc.)
export async function updateEmployee(
  employeeId: string,
  data: UpdateEmployeeData
) {
  try {
    if (!employeeId) {
      return { success: false, error: "Employee ID is required" };
    }

    const jwt = await getJWT();
    if (!jwt) {
      return { success: false, error: "Not authenticated" };
    }

    // Backend requires full payload; ensure required fields present
    if (
      data.email === undefined ||
      data.fullName === undefined ||
      data.phone === undefined ||
      data.role === undefined
    ) {
      return {
        success: false,
        error:
          "Full employee data required: email, fullName, phone, role must be provided",
      };
    }

    // Build payload from provided data only (complete set expected)
    const payload: Record<string, any> = {
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    };

    // Include password only if explicitly provided
    if (data.password !== undefined) payload.password = data.password;

    // Determine target branchId value for this operation
    const desiredBranchId =
      data.branchId === null
        ? null
        : data.branchId !== undefined
        ? data.branchId
        : undefined;

    // Include branchId only if assigning to a concrete branch (non-empty string)
    if (
      typeof desiredBranchId === "string" &&
      desiredBranchId.trim().length > 0
    ) {
      payload.branchId = desiredBranchId;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Choose endpoint: use branch-specific endpoint only when assigning to a branchId string
    const useBranchEndpoint =
      typeof desiredBranchId === "string" && desiredBranchId.trim().length > 0;
    const url = useBranchEndpoint
      ? `${baseUrl}/api/employees/${employeeId}/branch/${desiredBranchId}`
      : `${baseUrl}/api/employees/${employeeId}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = `Failed to update employee (HTTP ${res.status})`;
      try {
        const err = await res.json();
        msg = err.message || JSON.stringify(err) || msg;
      } catch {
        try {
          const txt = await res.text();
          if (txt) msg = `${msg}: ${txt}`;
        } catch {}
      }
      return { success: false, error: msg };
    }

    // Some backends may return 204 No Content or non-JSON bodies on success
    const contentType = res.headers.get("content-type") || "";
    if (res.status === 204 || !contentType.includes("application/json")) {
      return { success: true } as any;
    }
    try {
      const employee = await res.json();
      return { success: true, employee };
    } catch {
      // Fallback: treat as success when body isn't valid JSON on a 2xx status
      return { success: true } as any;
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    return {
      success: false,
      error: "Failed to update employee. Please try again.",
    };
  }
}

// Helper: set a specific employee as Branch Manager for a branch.
// Will demote any existing manager in that branch to Branch Cashier.
export async function setBranchManager(branchId: string, employeeId: string) {
  try {
    if (!branchId || !employeeId) {
      return {
        success: false,
        error: "Branch ID and Employee ID are required",
      };
    }

    // Fetch current employees of the branch to identify existing manager
    const listRes = await getBranchEmployees(branchId);
    if (!listRes.success) return listRes;

    const employees: Employee[] = listRes.employees || [];
    const currentManager = employees.find(
      (e) => e.role === "ROLE_BRANCH_MANAGER"
    );

    // Promote selected employee
    const promoteTarget = employees.find((e) => e.id === employeeId);
    if (!promoteTarget) {
      return { success: false, error: "Employee not found in branch list" };
    }
    const promoteRes = await updateEmployee(employeeId, {
      email: promoteTarget.email,
      fullName: promoteTarget.fullName,
      phone: promoteTarget.phone,
      role: "ROLE_BRANCH_MANAGER",
      branchId,
    });
    if (!promoteRes.success) return promoteRes;

    // Demote previous manager if different
    if (currentManager && currentManager.id !== employeeId) {
      const demoteRes = await updateEmployee(currentManager.id, {
        email: currentManager.email,
        fullName: currentManager.fullName,
        phone: currentManager.phone,
        role: "ROLE_BRANCH_CASHIER",
        branchId,
      });
      // If demotion fails, still return success but with warning
      if (!demoteRes.success) {
        const warnMsg =
          (demoteRes as any).error ||
          "New manager set, but failed to demote previous manager.";
        return {
          success: true,
          warning: warnMsg,
        } as any;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error setting branch manager:", error);
    return {
      success: false,
      error: "Failed to set branch manager. Please try again.",
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
