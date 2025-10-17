"use server";

import { getJWT } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ============= Types =============

export interface PaymentBreakdownDTO {
  paymentType: "CASH" | "CARD" | "MOBILE_MONEY";
  count: number;
  amount: number; // Backend returns 'amount'
}

export interface AnalyticsSummaryDTO {
  ordersCount: number;
  totalRevenue: number;
  payments: PaymentBreakdownDTO[];
}

export interface DailyTotalDTO {
  date: string; // LocalDate format: YYYY-MM-DD
  ordersCount: number;
  totalRevenue: number;
}

// ============= Helper Function =============

function formatDateForBackend(date: Date): string {
  // Format date as YYYY-MM-DD for backend
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ============= Cashier Analytics =============

export async function getCashierSummary(
  cashierId: string,
  from: Date,
  to: Date
): Promise<AnalyticsSummaryDTO | null> {
  try {
    const jwt = await getJWT();
    if (!jwt) {
      console.error("❌ No JWT token found");
      return null;
    }

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const url = `${API_URL}/api/analytics/cashier/${cashierId}/summary?from=${fromStr}&to=${toStr}`;
    console.log("🔍 Fetching cashier summary from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to fetch cashier summary:", errorText);
      return null;
    }

    const data = await response.json();
    console.log("✅ Cashier Summary API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching cashier summary:", error);
    return null;
  }
}

export async function getCashierDaily(
  cashierId: string,
  from: Date,
  to: Date
): Promise<DailyTotalDTO[]> {
  try {
    const jwt = await getJWT();
    if (!jwt) return [];

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/cashier/${cashierId}/daily?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to fetch cashier daily:", errorText);
      return [];
    }

    const data = await response.json();
    console.log("✅ Cashier Daily API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching cashier daily:", error);
    return [];
  }
}

// ============= Branch Analytics =============

export async function getBranchSummary(
  branchId: string,
  from: Date,
  to: Date
): Promise<AnalyticsSummaryDTO | null> {
  try {
    const jwt = await getJWT();
    if (!jwt) return null;

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/branch/${branchId}/summary?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch branch summary:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching branch summary:", error);
    return null;
  }
}

export async function getBranchDaily(
  branchId: string,
  from: Date,
  to: Date
): Promise<DailyTotalDTO[]> {
  try {
    const jwt = await getJWT();
    if (!jwt) return [];

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/branch/${branchId}/daily?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch branch daily:", await response.text());
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching branch daily:", error);
    return [];
  }
}

// ============= Store Analytics =============

export async function getStoreSummary(
  storeId: string,
  from: Date,
  to: Date
): Promise<AnalyticsSummaryDTO | null> {
  try {
    const jwt = await getJWT();
    if (!jwt) return null;

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/store/${storeId}/summary?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch store summary:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching store summary:", error);
    return null;
  }
}

export async function getStoreDaily(
  storeId: string,
  from: Date,
  to: Date
): Promise<DailyTotalDTO[]> {
  try {
    const jwt = await getJWT();
    if (!jwt) return [];

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/store/${storeId}/daily?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch store daily:", await response.text());
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching store daily:", error);
    return [];
  }
}

// ============= Global Analytics (Super Admin) =============

export async function getGlobalSummary(
  from: Date,
  to: Date
): Promise<AnalyticsSummaryDTO | null> {
  try {
    const jwt = await getJWT();
    if (!jwt) return null;

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/global/summary?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch global summary:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching global summary:", error);
    return null;
  }
}

export async function getGlobalDaily(
  from: Date,
  to: Date
): Promise<DailyTotalDTO[]> {
  try {
    const jwt = await getJWT();
    if (!jwt) return [];

    const fromStr = formatDateForBackend(from);
    const toStr = formatDateForBackend(to);

    const response = await fetch(
      `${API_URL}/api/analytics/global/daily?from=${fromStr}&to=${toStr}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch global daily:", await response.text());
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching global daily:", error);
    return [];
  }
}
