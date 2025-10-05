import { createSlice } from "@reduxjs/toolkit";
import {
  createInventory,
  deleteInventory,
  getInventoriesByBranch,
  getInventoriesByBranchAndProduct,
  getInventoryById,
  updateInventory,
} from "./inventoryThunk";

type Inventory = {
  id: string;
  // add other fields as needed, e.g. name: string;
};
interface InventoryState {
  inventories: Inventory[];
  loading: boolean;
  error: unknown;
}
const initialState: InventoryState = {
  inventories: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInventory.fulfilled, (state, action) => {
        state.inventories.push(action.payload);
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        const index = state.inventories.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.inventories = state.inventories.filter(
          (inv) => inv.id !== action.payload.id
        );
      })
      .addCase(getInventoriesByBranch.fulfilled, (state, action) => {
        state.inventories = action.payload;
      })
      .addCase(getInventoriesByBranchAndProduct.fulfilled, (state, action) => {
        state.inventories = action.payload;
      })
      .addCase(getInventoryById.fulfilled, (state, action) => {
        const index = state.inventories.findIndex(
          (inv) => inv.id === action.payload.id
        );
        if (index === -1) {
          state.inventories.push(action.payload);
        }
      });
  },
});

export default inventorySlice.reducer;
