import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { DataApiResponse } from '@/app/model';

export const apiResponseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getRestfulApiResponse: builder.query<DataApiResponse, string>({
      query(clientUrl: string) {
        return {
          url: `restful`,
          method: 'POST',
          body: clientUrl,
        };
      },
    }),
  }),
});

export const { useLazyGetRestfulApiResponseQuery } = apiResponseApi;
