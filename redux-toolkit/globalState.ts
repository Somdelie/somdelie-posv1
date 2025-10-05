// redux-toolkit/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./fetures/auth/authSlice";
import userReducer from "./fetures/user/userSlice";
import customerReducer from "./fetures/customer/customerSlice";
import orderReducer from "./fetures/order/orderSlice";
import refundReducer from "./fetures/refund/refundSlice";
import shiftReportReducer from "./fetures/shift-report/shiftReportSlice";
import branchReducer from "./fetures/branch/branchSlice";
import categoryReducer from "./fetures/category/categorySlice";
import inventoryReducer from "./fetures/inventory/inventorySlice";
import productReducer from "./fetures/product/productSlice";
import employeeReducer from "./fetures/employee/employeeSlice";
import storeReducer from "./fetures/store/storeSlice";
import cartReducer from "./fetures/cart/cartSlice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  customer: customerReducer,
  order: orderReducer,
  refund: refundReducer,
  shift: shiftReportReducer,
  branch: branchReducer,
  category: categoryReducer,
  employee: employeeReducer,
  inventory: inventoryReducer,
  product: productReducer,
  store: storeReducer,
  cart: cartReducer,
});

// Persist configuration - only persist cart state
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // Only persist cart reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create the store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// ✅ Export types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
