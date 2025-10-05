import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByBranch,
  getOrdersByCashier,
  getOrdersByCustomer,
  getRecentOrdersByBranch,
  getTodaysOrdersByBranch,
  updateOrder,
} from "./orderThunk";

interface Order {
  id: string;
  items: any[];
  totalAmount: number;
  status: string;
  customer?: string;
  cashier?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  todayOrders: Order[];
  customerOrders: Order[];
  selectedOrder: Order | null;
  recentOrders: Order[];
  loading: boolean;
  error: null | unknown;
}

const initialState: OrderState = {
  orders: [],
  todayOrders: [],
  customerOrders: [],
  selectedOrder: null,
  recentOrders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateOrder.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.loading = false;
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload.id
          );
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.selectedOrder = action.payload;
        }
      )
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrdersByBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOrdersByBranch.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getOrdersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrdersByCashier.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOrdersByCashier.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getOrdersByCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTodaysOrdersByBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getTodaysOrdersByBranch.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.todayOrders = action.payload;
        }
      )
      .addCase(getTodaysOrdersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrdersByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getOrdersByCustomer.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.customerOrders = action.payload;
        }
      )
      .addCase(getOrdersByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRecentOrdersByBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getRecentOrdersByBranch.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.recentOrders = action.payload;
        }
      )
      .addCase(getRecentOrdersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder, clearSelectedOrder } = orderSlice.actions;

export default orderSlice.reducer;
