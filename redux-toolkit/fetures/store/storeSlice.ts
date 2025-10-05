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
} from "./storeThunk";

type Store = {
  id: string;
  // add other fields as needed, e.g. name: string;
};

interface StoreState {
  stores: Store[];
  loading: boolean;
  error: unknown;
}
const initialState: StoreState = {
  stores: [],
  loading: false,
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
      .addCase(moderateStore.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(moderateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storeSlice.reducer;
