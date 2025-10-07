import { createSlice } from "@reduxjs/toolkit";
import {
  createStore,
  deleteStore,
  getStoreByAdmin,
  getStoreByEmployee,
  getStoreById,
  getStores,
  moderateStore,
  updateStore,
  fetchCurrentUserStore,
} from "./storeThunk";

export interface StoreAdmin {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  branchId: string | null;
  storeId: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  lastLogin: string | null;
}

export interface StoreContact {
  address: string;
  phone: string;
  email: string;
}

export interface StoreDetail {
  id: string;
  brandName: string;
  storeAdmin: StoreAdmin | null;
  createdDate: string;
  updatedDate: string | null;
  description: string | null;
  storeType: string;
  status: string;
  contact: StoreContact | null;
}

interface StoreState {
  stores: StoreDetail[]; // list (maybe admin view)
  selectedStore: StoreDetail | null; // current user's store
  loading: boolean;
  selectedStoreLoading: boolean;
  error: unknown;
}
const initialState: StoreState = {
  stores: [],
  selectedStore: null,
  loading: false,
  selectedStoreLoading: false,
  error: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores.push(action.payload);
        state.selectedStore = action.payload; // assume creator becomes owner
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index !== -1) {
          state.stores[index] = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = state.stores.filter(
          (store) => store.id !== action.payload.id
        );
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStoreById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id
        );
        if (index === -1) {
          state.stores.push(action.payload);
        } else {
          state.stores[index] = action.payload;
        }
        // If this store matches the currently selected one (by id), update selectedStore
        if (state.selectedStore?.id === action.payload.id) {
          state.selectedStore = action.payload;
        }
      })
      .addCase(getStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStoreByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getStoreByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStoreByEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(getStoreByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(moderateStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(moderateStore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(moderateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCurrentUserStore
      .addCase(fetchCurrentUserStore.pending, (state) => {
        state.selectedStoreLoading = true;
      })
      .addCase(fetchCurrentUserStore.fulfilled, (state, action) => {
        state.selectedStoreLoading = false;
        if (action.payload) {
          state.selectedStore = action.payload as StoreDetail;
          const idx = state.stores.findIndex((s) => s.id === action.payload.id);
          if (idx === -1) state.stores.push(action.payload as StoreDetail);
          else state.stores[idx] = action.payload as StoreDetail;
        }
      })
      .addCase(fetchCurrentUserStore.rejected, (state, action) => {
        state.selectedStoreLoading = false;
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;
