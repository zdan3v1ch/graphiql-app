import { EMPTY_ENDPOINT_URL_SYMBOL } from './constants';
import { ApiResponse, DataApiResponse, ErrorApiResponse } from './model';

export function removeLocaleFromUrl(path: string, locales: string[]): string {
  const localePattern = locales.join('|');
  const regex = new RegExp(`^/(${localePattern})/(.*)`);
  const match = path.match(regex);

  if (match?.[2]) {
    return match[2];
  }

  return path;
}

interface ApiRequestData {
  endpointUrl?: string;
  body?: string;
  headers?: Record<string, string>;
}

export interface RestfulRequestData extends ApiRequestData {
  method: string;
}

export type GraphqlRequestData = ApiRequestData;

function getApiRequestData(
  base64EncodedEndpointUrl?: string,
  base64EncodedBody?: string,
  queryString?: string
) {
  const apiRequestData: ApiRequestData = {};

  if (
    base64EncodedEndpointUrl &&
    base64EncodedEndpointUrl !== EMPTY_ENDPOINT_URL_SYMBOL
  ) {
    apiRequestData.endpointUrl = Buffer.from(
      base64EncodedEndpointUrl,
      'base64'
    ).toString('utf-8');
  }

  if (base64EncodedBody) {
    apiRequestData.body = Buffer.from(base64EncodedBody, 'base64').toString(
      'utf-8'
    );
  }

  if (queryString) {
    const headerPairs = queryString.split('&');
    const headers: Record<string, string> = {};

    for (const pair of headerPairs) {
      const [key, value] = pair.split('=');

      if (key) {
        headers[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }

    apiRequestData.headers = headers;
  }

  return apiRequestData;
}

export function parseRestfulClientUrl(url: string): RestfulRequestData {
  const [mainPart, queryString] = url.split('?');
  const [method, base64EncodedEndpointUrl, base64EncodedBody] =
    mainPart.split('/');
  const apiRequestData = getApiRequestData(
    base64EncodedEndpointUrl,
    base64EncodedBody,
    queryString
  );

  return {
    method,
    ...apiRequestData,
  };
}

export function parseGraphqlClientUrl(url: string): GraphqlRequestData {
  const [mainPart, queryString] = url.split('?');
  const [base64EncodedEndpointUrl, base64EncodedBody] = mainPart.split('/');

  return getApiRequestData(
    base64EncodedEndpointUrl,
    base64EncodedBody,
    queryString
  );
}

export function isDataApiResponse(
  response: ApiResponse
): response is DataApiResponse {
  return Object.hasOwnProperty.call(response, 'data');
}

export function isErrorApiResponse(
  response: ApiResponse
): response is ErrorApiResponse {
  return Object.hasOwnProperty.call(response, 'error');
}
