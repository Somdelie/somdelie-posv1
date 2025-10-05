import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [] as Array<any>,
  selectedCustomer: null as any,
  note: "",
  discount: { type: "amount", value: 0 } as {
    type: "amount" | "percentage";
    value: number;
  },
  paymentMethod: "cash" as string,
  heldOrders: [] as Array<any>,
  currentOrderId: null as string | null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.selectedCustomer = null;
      state.note = "";
      state.discount = { type: "amount", value: 0 };
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    setNote: (state, action) => {
      state.note = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    addHeldOrder: (state, action) => {
      state.heldOrders.push(action.payload);
    },
    removeHeldOrder: (state, action) => {
      state.heldOrders = state.heldOrders.filter(
        (order: any) => order.id !== action.payload
      );
    },
    restoreHeldOrder: (state, action) => {
      const order = action.payload;
      state.items = order.items;
      state.selectedCustomer = order.customer;
      state.note = order.note;
      state.discount = order.discount;
      // Remove from held orders
      state.heldOrders = state.heldOrders.filter((o: any) => o.id !== order.id);
    },
    setHeldOrders: (state, action) => {
      state.heldOrders = action.payload;
    },
    setCurrentOrderId: (state, action) => {
      state.currentOrderId = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setSelectedCustomer,
  setNote,
  setDiscount,
  setPaymentMethod,
  addHeldOrder,
  removeHeldOrder,
  restoreHeldOrder,
  setHeldOrders,
  setCurrentOrderId,
} = cartSlice.actions;

export default cartSlice.reducer;
