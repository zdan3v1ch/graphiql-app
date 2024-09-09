import { HTTP_METHOD, HTTP_METHODS } from 'next/dist/server/web/http';

export function isHttpMethod(value: string): value is HTTP_METHOD {
  return HTTP_METHODS.includes(value as HTTP_METHOD);
}
