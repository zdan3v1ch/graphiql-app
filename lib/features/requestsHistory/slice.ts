import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { GraphQlRequest, RestRequest } from './types';

export interface RequestsHistoryState {
  restRequests: RestRequest[];
  graphQlRequests: GraphQlRequest[];
}

const initialState: RequestsHistoryState = {
  restRequests: [],
  graphQlRequests: [],
};

const requestsHistorySlice = createSlice({
  name: 'requestsHistory',
  initialState,
  reducers: {
    addRestRequest(state: RequestsHistoryState, action: PayloadAction<RestRequest>) {
      state.restRequests.push(action.payload);
    },
    addGraphQlRequest(state: RequestsHistoryState, action: PayloadAction<GraphQlRequest>) {
      state.graphQlRequests.push(action.payload);
    },
  },
});

export const { addRestRequest, addGraphQlRequest } = requestsHistorySlice.actions;
export default requestsHistorySlice;
