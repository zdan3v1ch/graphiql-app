import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { DataApiResponse } from '@/app/model';
import { IntrospectionQuery } from 'graphql/utilities';

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
    getGraphqlApiSdl: builder.query<{ data: IntrospectionQuery }, string>({
      query(sdlUrl: string) {
        return {
          url: `graphql?sdlUrl=${encodeURIComponent(sdlUrl)}`,
          method: 'GET',
        };
      },
    }),
    getGraphqlApiResponse: builder.query<DataApiResponse, string>({
      query(clientUrl: string) {
        return {
          url: `graphql`,
          method: 'POST',
          body: clientUrl,
        };
      },
    }),
  }),
});

export const {
  useLazyGetRestfulApiResponseQuery,
  useLazyGetGraphqlApiSdlQuery,
  useLazyGetGraphqlApiResponseQuery,
} = apiResponseApi;
