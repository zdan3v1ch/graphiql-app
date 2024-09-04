interface RestfulRequestData {
  method: string;
  endpointUrl?: string;
  body?: string;
  headers?: Record<string, string>;
}

export function parseRestfulClientUrl(url: string) {
  const [mainPart, queryString] = url.split('?');
  const [method, base64EncodedEndpointUrl, base64EncodedBody] =
    mainPart.split('/');

  const requestData: RestfulRequestData = {
    method,
  };

  if (base64EncodedEndpointUrl) {
    requestData.endpointUrl = Buffer.from(
      base64EncodedEndpointUrl,
      'base64'
    ).toString('utf-8');
  }

  if (base64EncodedBody) {
    requestData.body = Buffer.from(base64EncodedBody, 'base64').toString(
      'utf-8'
    );
  }

  if (queryString) {
    const headerPairs = queryString.split('&');
    const headers: Record<string, string> = {};

    for (const pair of headerPairs) {
      const [key, value] = pair.split('=');
      headers[decodeURIComponent(key)] = decodeURIComponent(value);
    }

    requestData.headers = headers;
  }

  return requestData;
}
