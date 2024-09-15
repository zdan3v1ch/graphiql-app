import { RestfulRequestData } from '@/app/utils';
import z from 'zod';
import { HTTP_METHODS } from 'next/dist/server/web/http';

export function validateRequestData(requestData: RestfulRequestData) {
  const { method, endpointUrl, headers, body } = requestData;
  const { data: validParsedMethod } = z.enum(HTTP_METHODS).safeParse(method);
  const { data: validParsedEndpointUrl } = z.string().safeParse(endpointUrl);
  const { data: validParsedHeaders } = z
    .record(z.string(), z.string())
    .safeParse(headers);
  const { data: validParsedBody } = z.string().safeParse(body);

  return {
    validParsedMethod,
    validParsedEndpointUrl,
    validParsedHeaders,
    validParsedBody,
  };
}

export function variableSubstitute(
  body: string,
  variables: [string, string][]
) {
  let newBody = body;
  variables.forEach(([key, value]) => {
    newBody = newBody.replaceAll(`{{${key}}}`, value);
  });
  return newBody;
}
