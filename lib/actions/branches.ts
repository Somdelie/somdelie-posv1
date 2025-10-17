"use server";
import { getJWT } from "./auth";

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  workingDays: string[];
  openingTime: string | null;
  closingTime: string | null;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  store?: any;
  manager?: any;
}

export interface CreateBranchData {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  workingDays: string[];
  openingTime?: string;
  closingTime?: string;
}

export interface UpdateBranchData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingDays?: string[];
  openingTime?: string;
  closingTime?: string;
}

// Normalize working day strings to backend enum names
const DAY_MAP_SHORT_TO_ENUM: Record<string, string> = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
};

function normalizeWorkingDays(
  days: string[] | undefined
): string[] | undefined {
  if (!days) return days;
  return days.map((d) => DAY_MAP_SHORT_TO_ENUM[d] || d);
}

// Create a new branch
export async function createBranch(
  storeId: string,
  branchData: CreateBranchData
) {
  try {
    console.log("=== CREATE BRANCH DEBUG ===");
    console.log("1. Function called with:");
    console.log("   storeId:", storeId);
    console.log("   branchData:", branchData);

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

    // Clean the branch data to remove any undefined/null values
    const cleanBranchData: any = {
      name: branchData.name,
      address: branchData.address,
      workingDays: normalizeWorkingDays(branchData.workingDays),
    };

    // Only add optional fields if they exist and are not empty
    if (
      branchData.phone &&
      typeof branchData.phone === "string" &&
      branchData.phone.trim() !== ""
    ) {
      cleanBranchData.phone = branchData.phone;
      console.log("   Including phone:", branchData.phone);
    }

    if (
      branchData.email &&
      typeof branchData.email === "string" &&
      branchData.email.trim() !== ""
    ) {
      cleanBranchData.email = branchData.email;
      console.log("   Including email:", branchData.email);
    }

    if (
      branchData.openingTime &&
      typeof branchData.openingTime === "string" &&
      branchData.openingTime.trim() !== ""
    ) {
      cleanBranchData.openingTime = branchData.openingTime;
      console.log("   Including openingTime:", branchData.openingTime);
    }

    if (
      branchData.closingTime &&
      typeof branchData.closingTime === "string" &&
      branchData.closingTime.trim() !== ""
    ) {
      cleanBranchData.closingTime = branchData.closingTime;
      console.log("   Including closingTime:", branchData.closingTime);
    }

    console.log("3. Cleaned branch data:", cleanBranchData);

    const apiUrl = `http://localhost:5000/api/branches`;
    console.log("4. Making API call to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ ...cleanBranchData, storeId }),
    });

    console.log("5. API Response status:", response.status);
    console.log("6. API Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("7. ERROR Response data:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to create branch",
      };
    }

    const branch = await response.json();
    console.log("8. SUCCESS: Branch created:", branch);
    console.log("=== END CREATE BRANCH DEBUG ===");
    return { success: true, branch };
  } catch (error) {
    console.error("9. EXCEPTION in createBranch:", error);
    console.log("=== END CREATE BRANCH DEBUG (ERROR) ===");
    return {
      success: false,
      error: "Failed to create branch. Please try again.",
    };
  }
}

// Get all branches for a store
export async function getStoreBranches(storeId: string) {
  try {
    console.log("=== GET STORE BRANCHES DEBUG ===");
    console.log("1. Fetching branches for storeId:", storeId);

    if (!storeId) {
      console.log("ERROR: Store ID is missing!");
      return { success: false, error: "Store ID is required" };
    }

    const jwt = await getJWT();

    console.log("Json.stringify(jwt)", JSON.stringify(jwt));

    if (!jwt) {
      console.log("ERROR: JWT token is missing!");
      return { success: false, error: "Not authenticated" };
    }

    console.log("2. JWT token obtained successfully");

    const apiUrl = `http://localhost:5000/api/branches/store/${storeId}`;
    console.log("3. Making API call to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store", // Prevent caching for fresh data
    });

    console.log("4. API Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("5. ERROR Response data:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to fetch branches",
      };
    }

    const branches = await response.json();
    console.log("6. SUCCESS: Fetched branches count:", branches.length);
    console.log("=== END GET STORE BRANCHES DEBUG ===");
    return { success: true, branches };
  } catch (error) {
    console.error("7. EXCEPTION in getStoreBranches:", error);
    console.log("=== END GET STORE BRANCHES DEBUG (ERROR) ===");
    return {
      success: false,
      error: "Failed to fetch branches. Please try again.",
    };
  }
}

// Get a single branch by ID
export async function getBranchById(branchId: string) {
  try {
    console.log("=== GET BRANCH BY ID DEBUG ===");
    console.log("1. Fetching branch with ID:", branchId);

    if (!branchId) {
      console.log("ERROR: Branch ID is missing!");
      return { success: false, error: "Branch ID is required" };
    }

    const jwt = await getJWT();

    if (!jwt) {
      console.log("ERROR: JWT token is missing!");
      return { success: false, error: "Not authenticated" };
    }

    console.log("2. JWT token obtained successfully");

    const apiUrl = `http://localhost:5000/api/branches/${branchId}`;
    console.log("3. Making API call to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

    console.log("4. API Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("5. ERROR Response data:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to fetch branch",
      };
    }

    const branch = await response.json();
    console.log("6. SUCCESS: Branch fetched:", branch);
    console.log("=== END GET BRANCH BY ID DEBUG ===");
    return { success: true, branch };
  } catch (error) {
    console.error("7. EXCEPTION in getBranchById:", error);
    console.log("=== END GET BRANCH BY ID DEBUG (ERROR) ===");
    return {
      success: false,
      error: "Failed to fetch branch. Please try again.",
    };
  }
}

// Helper to fetch detailed branch info (including manager) if backend provides it
export async function getBranchDetails(branchId: string) {
  return getBranchById(branchId);
}

// Update a branch
export async function updateBranch(
  branchId: string,
  branchData: UpdateBranchData
) {
  try {
    console.log("=== UPDATE BRANCH DEBUG ===");
    console.log("1. Function called with:");
    console.log("   branchId:", branchId);
    console.log("   branchData:", branchData);

    if (!branchId) {
      console.log("ERROR: Branch ID is missing!");
      return { success: false, error: "Branch ID is required" };
    }

    const jwt = await getJWT();

    if (!jwt) {
      console.log("ERROR: JWT token is missing!");
      return { success: false, error: "Not authenticated" };
    }

    console.log("2. JWT token obtained successfully");

    // Clean the branch data to remove any undefined/null/empty values
    const cleanBranchData: any = {};

    if (branchData.name && branchData.name.trim() !== "") {
      cleanBranchData.name = branchData.name;
    }

    if (branchData.address && branchData.address.trim() !== "") {
      cleanBranchData.address = branchData.address;
    }

    if (branchData.phone !== undefined) {
      cleanBranchData.phone =
        branchData.phone && branchData.phone.trim() !== ""
          ? branchData.phone
          : null;
    }

    if (branchData.email !== undefined) {
      cleanBranchData.email =
        branchData.email && branchData.email.trim() !== ""
          ? branchData.email
          : null;
    }

    if (branchData.workingDays && branchData.workingDays.length > 0) {
      cleanBranchData.workingDays = normalizeWorkingDays(
        branchData.workingDays
      );
    }

    if (branchData.openingTime !== undefined) {
      cleanBranchData.openingTime =
        branchData.openingTime && branchData.openingTime.trim() !== ""
          ? branchData.openingTime
          : null;
    }

    if (branchData.closingTime !== undefined) {
      cleanBranchData.closingTime =
        branchData.closingTime && branchData.closingTime.trim() !== ""
          ? branchData.closingTime
          : null;
    }

    console.log("3. Cleaned branch data:", cleanBranchData);

    const apiUrl = `http://localhost:5000/api/branches/${branchId}`;
    console.log("4. Making API call to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(cleanBranchData),
    });

    console.log("5. API Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("6. ERROR Response data:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to update branch",
      };
    }

    const branch = await response.json();
    console.log("7. SUCCESS: Branch updated:", branch);
    console.log("=== END UPDATE BRANCH DEBUG ===");
    return { success: true, branch };
  } catch (error) {
    console.error("8. EXCEPTION in updateBranch:", error);
    console.log("=== END UPDATE BRANCH DEBUG (ERROR) ===");
    return {
      success: false,
      error: "Failed to update branch. Please try again.",
    };
  }
}

// Delete a branch
export async function deleteBranch(branchId: string) {
  try {
    console.log("=== DELETE BRANCH DEBUG ===");
    console.log("1. Deleting branch with ID:", branchId);

    if (!branchId) {
      console.log("ERROR: Branch ID is missing!");
      return { success: false, error: "Branch ID is required" };
    }

    const jwt = await getJWT();

    if (!jwt) {
      console.log("ERROR: JWT token is missing!");
      return { success: false, error: "Not authenticated" };
    }

    console.log("2. JWT token obtained successfully");

    const apiUrl = `http://localhost:5000/api/branches/${branchId}`;
    console.log("3. Making API call to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    console.log("4. API Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("5. ERROR Response data:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to delete branch",
      };
    }

    console.log("6. SUCCESS: Branch deleted");
    console.log("=== END DELETE BRANCH DEBUG ===");
    return { success: true };
  } catch (error) {
    console.error("7. EXCEPTION in deleteBranch:", error);
    console.log("=== END DELETE BRANCH DEBUG (ERROR) ===");
    return {
      success: false,
      error: "Failed to delete branch. Please try again.",
    };
  }
}

// Server action for creating branch with form data
export async function createBranchAction(storeId: string, formData: FormData) {
  try {
    const workingDaysString = formData.get("workingDays") as string;
    const workingDays = workingDaysString
      ? workingDaysString.split(",").filter((day) => day.trim() !== "")
      : [];

    const branchData: CreateBranchData = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: (formData.get("phone") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      workingDays,
      openingTime: (formData.get("openingTime") as string) || undefined,
      closingTime: (formData.get("closingTime") as string) || undefined,
    };

    return await createBranch(storeId, branchData);
  } catch (error) {
    console.error("Error in createBranchAction:", error);
    return {
      success: false,
      error: "Failed to create branch. Please try again.",
    };
  }
}

// Server action for updating branch with form data
export async function updateBranchAction(branchId: string, formData: FormData) {
  try {
    const workingDaysString = formData.get("workingDays") as string;
    const workingDays = workingDaysString
      ? workingDaysString.split(",").filter((day) => day.trim() !== "")
      : undefined;

    const branchData: UpdateBranchData = {
      name: (formData.get("name") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      workingDays,
      openingTime: (formData.get("openingTime") as string) || undefined,
      closingTime: (formData.get("closingTime") as string) || undefined,
    };

    return await updateBranch(branchId, branchData);
  } catch (error) {
    console.error("Error in updateBranchAction:", error);
    return {
      success: false,
      error: "Failed to update branch. Please try again.",
    };
  }
}
