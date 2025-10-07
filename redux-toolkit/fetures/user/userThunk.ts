import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUserStoreContext } from "@/redux-toolkit/fetures/auth/authSlice";

// Thunk to get user profile
export const getUserProfile = createAsyncThunk(
  "/user/getProfile",
  async (token: string, { getState, rejectWithValue }) => {
    const { user } = getState() as any;
    if (user.userProfile) return user.userProfile; // prevent duplicate fetch

    try {
      const response = await api.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Fetching User Profile Failed!"
      );
    }
  }
);

// Thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "/user/updateProfile",
  async (
    { token, userData }: { token: string; userData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put("/api/user/profile/update", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data, "response from updateUserProfile thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Updating User Profile Failed!"
      );
    }
  }
);

// Thunk to delete user account
export const deleteUserAccount = createAsyncThunk(
  "/user/deleteProfile",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.delete("/api/user/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data, "response from deleteUserAccount thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Deleting User Account Failed!"
      );
    }
  }
);

// thunk to get customers
export const getCustomers = createAsyncThunk(
  "/user/getCustomers",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data, "response from getCustomers thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Customers Failed!"
      );
    }
  }
);

// thunk to all cashiers
export const getCashiers = createAsyncThunk(
  "/user/getCashiers",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users/cashiers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data, "response from getCashiers thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Cashiers Failed!"
      );
    }
  }
);

// thunk to get user by ID
export const getUserById = createAsyncThunk(
  "/user/getUserById",
  async (
    { userId }: { token: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const data = response.data;
      console.log(data, "response from getUserById thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching User Failed!"
      );
    }
  }
);

// thunk to get all users
export const getAllUsers = createAsyncThunk(
  "/user/getUsers",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data, "response from getAllUsers thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Fetching Users Failed!"
      );
    }
  }
);

// thunk to logout user
export const logoutUser = createAsyncThunk(
  "/user/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("jwt");
      // Clear JWT cookie
      document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      const data = { message: "Logged out successfully" };
      console.log(data, "response from logoutUser thunk");
      return data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Logging out Failed!"
      );
    }
  }
);

// Thunk to elevate a plain user to store admin and attach newly created storeId
// Assumptions:
//  - Backend update endpoint accepts partial body with { role, storeId }
//  - Endpoint: PUT /api/user/profile/update (consistent with updateUserProfile above)
//  - Returns updated user profile object
export const elevateUserToStoreAdmin = createAsyncThunk(
  "/user/elevateStoreAdmin",
  async (
    { storeId, role }: { storeId: string; role?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return rejectWithValue("No active session");

      const desiredRole = role || "ROLE_STORE_ADMIN";
      const response = await api.put(
        "/api/user/profile/update",
        { role: desiredRole, storeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Immediately patch auth state so UI unlocks dashboard access
      dispatch(
        setUserStoreContext({
          storeId,
          role: desiredRole,
        })
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Elevating user to store admin failed!"
      );
    }
  }
);
