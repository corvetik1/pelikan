import { configureStore } from '@reduxjs/toolkit';
import { emptySplitApi } from './api';

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(emptySplitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
