import { configureStore } from '@reduxjs/toolkit';
import requestsHistorySlice from '@/lib/features/requestsHistory/slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      requestsHistory: requestsHistorySlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
