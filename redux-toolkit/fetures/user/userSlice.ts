import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsers,
  getCashiers,
  getCustomers,
  getUserById,
  getUserProfile,
  logoutUser,
} from "./userThunk";

// Initial state for user slice
const initialState = {
  userProfile: null,
  users: [],
  selectedUser: null,
  customers: [],
  cashiers: [],
  loading: false,
  error: null as unknown,
};

// user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.users = [];
      state.customers = [];
      state.cashiers = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add cases for user-related thunks here
    builder.addCase(getUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      // ❌ don't reset userProfile
    });

    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as unknown;
    });
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
    // get all users
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.users = [];
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as unknown;
    });
    builder.addCase(getUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.selectedUser = null;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedUser = action.payload;
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as unknown;
    });
    builder.addCase(getCashiers.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.cashiers = [];
    });
    builder.addCase(getCashiers.fulfilled, (state, action) => {
      state.loading = false;
      state.cashiers = action.payload;
    });
    builder.addCase(getCashiers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as unknown;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.users = [];
      state.customers = [];
      state.cashiers = [];
      state.loading = false;
      state.error = null;
    });
  },
});

export default userSlice.reducer;
