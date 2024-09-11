import z from 'zod';

export interface DataApiResponse {
  status: number;
  data: unknown;
}

export interface ErrorApiResponse {
  error: unknown;
}

export type ApiResponse = DataApiResponse | ErrorApiResponse;
export type GraphqlSdlResponse = unknown;

export const rtkQueryErrorSchema = z.object({
  status: z.number(),
  data: z.object({
    error: z.string(),
  }),
});
