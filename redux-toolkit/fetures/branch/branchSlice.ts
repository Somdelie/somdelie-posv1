import { createSlice } from "@reduxjs/toolkit";
import {
  createBranch,
  deleteBranch,
  getBranchesByStore,
  getBranchById,
  updateBranch,
} from "./branchThunk";

const initialState = {
  branch: null as any,
  branches: [] as Array<any>,
  employees: [] as Array<any>,
  loading: false,
  error: null as string | null,
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle async thunks here
    builder
      // Create Branch state handling
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
        if (state.branch.id === action.payload.id) {
          state.branch = action.payload;
        }
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Branches by Store state handling
      .addCase(getBranchesByStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchesByStore.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getBranchesByStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Branch by ID state handling
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.branch = action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateBranch state handling
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        // Update the branch in the branches array
        const index = state.branches.findIndex(
          (branch) => branch.id === action.payload.id
        );
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
        // If the updated branch is the currently selected branch, update it as well
        if (state.branch && state.branch.id === action.payload.id) {
          state.branch = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteBranch state handling
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted branch from the branches array
        state.branches = state.branches.filter(
          (branch: { id: any }) => branch.id !== action.payload.id
        );
        // If the deleted branch is the currently selected branch, clear it as well
        if (state.branch && state.branch.id === action.payload.id) {
          state.branch = null;
        }
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default branchSlice.reducer;
