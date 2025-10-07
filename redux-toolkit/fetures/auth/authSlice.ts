import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, signup } from "./authThunk";

// ✅ Define the shape of the auth response (same as in authThunk)
interface AuthResponse {
  jwt: string;
  user?: {
    profileImage?: string;
    fullName?: string;
    email?: string;
    role?: string;
    storeId?: string; // added for stronger typing
    branchId?: string; // added for stronger typing
  };
  role?: string;
  fullName?: string;
  email?: string;
}

// ✅ Define the shape of the auth slice state
interface AuthState {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("jwt");
      // Clear JWT cookie
      document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
    setUserStoreContext: (
      state,
      action: PayloadAction<{
        storeId?: string;
        branchId?: string;
        role?: string;
      }>
    ) => {
      if (!state.user) return;
      // Ensure nested user object exists
      if (!state.user.user) state.user.user = {} as any;
      const { storeId, branchId, role } = action.payload;
      if (storeId) (state.user.user as any).storeId = storeId;
      if (branchId) (state.user.user as any).branchId = branchId;
      if (role) (state.user.user as any).role = role;
    },
    replaceJwt: (state, action: PayloadAction<string>) => {
      if (!state.user) {
        state.user = { jwt: action.payload } as any;
      } else {
        (state.user as any).jwt = action.payload;
      }
      // Persist in both storages
      localStorage.setItem("jwt", action.payload);
      document.cookie = `jwt=${action.payload}; path=/; max-age=604800; SameSite=Strict`;
    },
  },
  extraReducers: (builder) => {
    // ✅ Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUserStoreContext, replaceJwt } = authSlice.actions;
export default authSlice.reducer;
