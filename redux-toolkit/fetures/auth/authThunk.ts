import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Define the shape of credentials and response data
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  jwt: string;
  user?: any; // replace with your real user type if available
}

// ✅ Signup thunk with proper user registration data
interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export const signup = createAsyncThunk<
  AuthResponse, // return type
  SignupData, // argument type
  { rejectValue: string } // rejectWithValue type
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/signup", userData);
    // Store JWT in both localStorage (for client-side) and cookies (for middleware)
    localStorage.setItem("jwt", response.data.jwt);
    document.cookie = `jwt=${response.data.jwt}; path=/; max-age=604800; SameSite=Strict`;
    console.log(response.data, "response from signup thunk");
    return response.data;
  } catch (error: any) {
    console.log(error, "error in signup thunk");
    return rejectWithValue(error.response?.data?.message || "Signup Failed!");
  }
});

// ✅ Login thunk with proper typing
export const login = createAsyncThunk<
  AuthResponse, // return type
  LoginCredentials, // argument type
  { rejectValue: string } // rejectWithValue type
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    // Store JWT in both localStorage (for client-side) and cookies (for middleware)
    localStorage.setItem("jwt", response.data.jwt);
    document.cookie = `jwt=${response.data.jwt}; path=/; max-age=604800; SameSite=Strict`;
    console.log(response.data, "response from login thunk");
    return response.data;
  } catch (error: any) {
    console.log(error, "error in login thunk");
    return rejectWithValue(error.response?.data?.message || "Login Failed!");
  }
});
