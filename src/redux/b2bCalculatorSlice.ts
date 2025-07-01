import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface B2BCalculatorState {
  /** Идентификатор выбранного товара */
  productId: string;
  /** Объём закупки (кол-во единиц или килограмм) */
  quantity: number;
  /** Карта цен { productId: price } */
  prices: Record<string, number>;
  /** Позиции расчёта */
  items: Array<{ id: string; quantity: number }>;
}

const initialState: B2BCalculatorState = {
  productId: '',
  quantity: 0,
  prices: {},
  items: [],
};

const b2bCalculatorSlice = createSlice({
  name: 'b2bCalculator',
  initialState,
  reducers: {
    setProduct(state, action: PayloadAction<string>) {
      state.productId = action.payload;
    },
    setQuantity(state, action: PayloadAction<number>) {
      state.quantity = action.payload;
    },
    setPrices(state, action: PayloadAction<Record<string, number>>) {
      state.prices = action.payload;
    },
    addItem(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateItemQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    resetCalculator() {
      return initialState;
    },
  },
});

export const { setProduct, setQuantity, setPrices, addItem, updateItemQuantity, removeItem, resetCalculator } = b2bCalculatorSlice.actions;

export default b2bCalculatorSlice.reducer;
