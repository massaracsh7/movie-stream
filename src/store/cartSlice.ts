// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LineItem } from '@commercetools/platform-sdk'; // Adjust the import path as needed

interface CartState {
  id: string;
  version: number;
  quantity: number;
  items: LineItem[];
}

const initialState: CartState = {
  id: '',
  version: 1,
  quantity: 0,
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartData(state, action: PayloadAction<Partial<CartState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateCartData } = cartSlice.actions;
export default cartSlice.reducer;
