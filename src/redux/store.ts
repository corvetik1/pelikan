import { configureStore } from '@reduxjs/toolkit';
import catalogFiltersReducer from './catalogFiltersSlice';
import b2bCalculatorReducer from './b2bCalculatorSlice';
import { emptySplitApi } from './api';

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    catalogFilters: catalogFiltersReducer,
    b2bCalculator: b2bCalculatorReducer,
  },
  middleware: (getDefault) => getDefault().concat(emptySplitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
