import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import catalogFiltersReducer from './catalogFiltersSlice';
import b2bCalculatorReducer from './b2bCalculatorSlice';
import snackbarReducer from './snackbarSlice';
import { emptySplitApi } from '@/redux/api';

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    catalogFilters: catalogFiltersReducer,
    b2bCalculator: b2bCalculatorReducer,
    snackbar: snackbarReducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(emptySplitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
