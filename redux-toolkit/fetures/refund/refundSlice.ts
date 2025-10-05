import { createSlice } from "@reduxjs/toolkit";
import {
  createRefund,
  getAllRefunds,
  getRefundById,
  getRefundsByBranch,
  getRefundsByCashier,
  getRefundsByCashierAndDate,
  getRefundsByShift,
} from "./refundThunk";

interface Refund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  cashierId: string;
  branchId: string;
  shiftId: string;
  date: string;
}

const initialState = {
  refunds: [] as Refund[],
  refundsByCashier: [] as Refund[],
  refundsByBranch: [] as Refund[],
  refundsByShift: [] as Refund[],
  refundsByDateRange: [] as Refund[],
  selectedRefund: null as Refund | null,
  loading: false,
  error: null as string | null,
};

const refundSlice = createSlice({
  name: "refund",
  initialState,
  reducers: {
    setSelectedRefund: (state, action) => {
      state.selectedRefund = action.payload;
    },
    clearSelectedRefund: (state) => {
      state.selectedRefund = null;
    },
  },
  extraReducers: (builder) => {
    // Add cases for your thunks here
    builder
      .addCase(createRefund.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRefund.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds.push(action.payload);
      })
      .addCase(createRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllRefunds.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds = action.payload;
      })
      .addCase(getAllRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRefundsByCashier.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRefundsByCashier.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByCashier = action.payload;
      })
      .addCase(getRefundsByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRefundsByBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRefundsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByBranch = action.payload;
      })
      .addCase(getRefundsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRefundsByCashierAndDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRefundsByCashierAndDate.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByDateRange = action.payload;
      })
      .addCase(getRefundsByCashierAndDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRefundsByShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRefundsByShift.fulfilled, (state, action) => {
        state.loading = false;
        state.refundsByShift = action.payload;
      })
      .addCase(getRefundsByShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRefundById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRefundById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRefund = action.payload;
      })
      .addCase(getRefundById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedRefund, clearSelectedRefund } = refundSlice.actions;

export default refundSlice.reducer;
