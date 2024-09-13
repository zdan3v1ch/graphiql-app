import { isHttpMethod } from '@/app/[lng]/[...slug]/utils';

describe('isHttpMethod', () => {
  it('should return true for valid HTTP methods', () => {
    expect(isHttpMethod('GET')).toBe(true);
    expect(isHttpMethod('POST')).toBe(true);
    expect(isHttpMethod('PUT')).toBe(true);
    expect(isHttpMethod('DELETE')).toBe(true);
    expect(isHttpMethod('PATCH')).toBe(true);
    expect(isHttpMethod('OPTIONS')).toBe(true);
    expect(isHttpMethod('HEAD')).toBe(true);
  });

  it('should return false for invalid HTTP methods', () => {
    expect(isHttpMethod('INVALID')).toBe(false);
    expect(isHttpMethod('CONNECT')).toBe(false);
    expect(isHttpMethod('TRACE')).toBe(false);
    expect(isHttpMethod('')).toBe(false);
    expect(isHttpMethod('123')).toBe(false);
  });
});
