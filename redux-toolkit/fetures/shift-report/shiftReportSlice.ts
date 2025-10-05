import { createSlice, current } from "@reduxjs/toolkit";
import {
  endShift,
  getCurrentShiftProgress,
  getAllShiftsByBranch,
  getShiftByCashier,
  getShiftById,
  getShiftReportByDate,
  startShift,
} from "./shiftReportThunk";

interface Shift {
  id: string;
  // add other properties as needed
  // e.g. startTime?: string;
  // endTime?: string;
}

interface ShiftReportState {
  shifts: Shift[];
  currentShift: Shift | null;
  selectedShift: Shift | null;
  shiftByCashier: Shift[];
  shiftByBranch: Shift[];
  loading: boolean;
  error: unknown;
}

// fetchShiftProgress
// getShiftReportByDate
// getShiftByCashier
// getAllShiftsByBranch
// getShiftById

const initialState: ShiftReportState = {
  shifts: [],
  currentShift: null,
  selectedShift: null,
  shiftByCashier: [],
  shiftByBranch: [],
  loading: false,
  error: null,
};

const shiftReportSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Start Shift state handling
      .addCase(startShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(startShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // end Shift state handling
      .addCase(endShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endShift.fulfilled, (state, action) => {
        state.loading = false;
        // Update the currentShift with the end time and final stats
        if (state.currentShift && state.currentShift.id === action.payload.id) {
          state.currentShift = action.payload;
        }
        // update the shifts array
        const index = state.shifts.findIndex(
          (shift) => shift.id === action.payload.id
        );
        if (index !== -1) {
          state.shifts[index] = action.payload;
        }
      })
      .addCase(endShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Shift Progress state handling
      .addCase(getCurrentShiftProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentShiftProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(getCurrentShiftProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Shift By Id state handling
      .addCase(getShiftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShift = action.payload;
      })
      .addCase(getShiftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Shift By Cashier state handling
      .addCase(getShiftByCashier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftByCashier.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftByCashier = action.payload;
      })
      .addCase(getShiftByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Get All Shifts By Branch state handling
    builder
      .addCase(getAllShiftsByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllShiftsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftByBranch = action.payload;
      })
      .addCase(getAllShiftsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Get Shift Report By Date state handling
    builder
      .addCase(getShiftReportByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftReportByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(getShiftReportByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shiftReportSlice.reducer;
