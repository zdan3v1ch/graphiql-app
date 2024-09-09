import { EMPTY_ENDPOINT_URL_SYMBOL } from './constants';

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
  headers?: Record<string, string>;
}

export interface RestfulRequestData extends ApiRequestData {
  method: string;
  body?: string;
}

export interface GraphqlRequestData extends ApiRequestData {
  method: string;
  body?: string;
}

function getApiRequestData(
  base64EncodedEndpointUrl?: string,
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
    queryString
  );
  const restfulRequestData: RestfulRequestData = { method, ...apiRequestData };

  if (base64EncodedBody) {
    restfulRequestData.body = Buffer.from(base64EncodedBody, 'base64').toString(
      'utf-8'
    );
  }

  return restfulRequestData;
}

export function parseGraphqlClientUrl(url: string): GraphqlRequestData {
  const [mainPart, queryString] = url.split('?');
  const [method, base64EncodedEndpointUrl, base64EncodedBody] =
    mainPart.split('/');
  const apiRequestData = getApiRequestData(
    base64EncodedEndpointUrl,
    queryString
  );
  const graphqlRequestData: GraphqlRequestData = { method, ...apiRequestData };

  // if (base64EncodedBody) {
  //   const body = Buffer.from(base64EncodedBody, 'base64').toString('utf-8');
  //   const { data: validBody, success } = z
  //     .object({
  //       query: z.string(),
  //       variables:z.string(),
  //     })
  //     .safeParse(body);

  //   if (success) {
  //     graphqlRequestData.body = validBody;
  //   }
  // }
  if (base64EncodedBody) {
    graphqlRequestData.body = Buffer.from(base64EncodedBody, 'base64').toString(
      'utf-8'
    );
  }

  return graphqlRequestData;
}
