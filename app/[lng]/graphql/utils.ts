import { GraphqlRequestData } from '@/app/utils';
import z from 'zod';

export function validateRequestGraphqlData(requestData: GraphqlRequestData) {
  const { endpointUrl, headers, body } = requestData;
  const { data: validParsedEndpointUrl } = z.string().safeParse(endpointUrl);
  const { data: validParsedHeaders } = z
    .record(z.string(), z.string())
    .safeParse(headers);
  const { data: validParsedBody } = z.string().safeParse(body);

  return {
    validParsedEndpointUrl,
    validParsedHeaders,
    validParsedBody,
  };
}
