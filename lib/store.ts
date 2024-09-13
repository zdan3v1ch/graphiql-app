import { configureStore } from '@reduxjs/toolkit';
import { apiResponseApi } from '@/lib/services/apiResponse';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiResponseApi.reducerPath]: apiResponseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiResponseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
