export interface DataApiResponse {
  status: number;
  data: unknown;
}

export interface ErrorApiResponse {
  error: unknown;
}

export type ApiResponse = DataApiResponse | ErrorApiResponse;
export type GraphqlSdlResponse = unknown;
