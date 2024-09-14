import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import {
  removeLocaleFromUrl,
  parseRestfulClientUrl,
  parseGraphiQlUrl,
  isValidJsonString,
} from '@/app/utils';

describe('removeLocaleFromUrl', () => {
  it('removes the locale from the path', () => {
    const locales = ['en', 'fr'];
    const path = '/en/some/path';
    const result = removeLocaleFromUrl(path, locales);
    expect(result).toBe('/some/path');
  });

  it('returns the path unchanged if no locale is present', () => {
    const locales = ['en', 'fr'];
    const path = '/some/path';
    const result = removeLocaleFromUrl(path, locales);
    expect(result).toBe('/some/path');
  });
});

describe('parseRestfulClientUrl', () => {
  it('parses a valid RESTful client URL', () => {
    const url =
      'get/aHR0cHM6Ly9leGFtcGxlLmNvbQ==/Ym9keQ==?header1=value1&header2=value2';
    const result = parseRestfulClientUrl(url);
    expect(result.method).toBe('GET');
    expect(result.endpointUrl).toBe('https://example.com');
    expect(result.body).toBe('body');
    expect(result.headers).toEqual({
      header1: 'value1',
      header2: 'value2',
    });
  });

  it('handles missing body and headers', () => {
    const url = 'post/aHR0cHM6Ly9leGFtcGxlLmNvbQ==';
    const result = parseRestfulClientUrl(url);
    expect(result.method).toBe('POST');
    expect(result.endpointUrl).toBe('https://example.com');
    expect(result.body).toBeUndefined();
    expect(result.headers).toBeUndefined();
  });

  it('returns an empty object if the endpoint URL is empty or matches the empty symbol', () => {
    const url = 'post/' + EMPTY_ENDPOINT_URL_SYMBOL;
    const result = parseRestfulClientUrl(url);
    expect(result.method).toBe('POST');
    expect(result.endpointUrl).toBeUndefined();
  });
});

describe('parseGraphiQlUrl', () => {
  it('parses a valid GraphiQL URL', () => {
    const url =
      '/aHR0cHM6Ly9leGFtcGxlLmNvbQ==/Ym9keQ==?header1=value1&header2=value2';
    const result = parseGraphiQlUrl(url);
    expect(result.endpointUrl).toBe('https://example.com');
    expect(result.body).toBe('body');
    expect(result.headers).toEqual({
      header1: 'value1',
      header2: 'value2',
    });
  });

  it('handles missing body and headers', () => {
    const url = '/aHR0cHM6Ly9leGFtcGxlLmNvbQ==';
    const result = parseGraphiQlUrl(url);
    expect(result.endpointUrl).toBe('https://example.com');
    expect(result.body).toBeUndefined();
    expect(result.headers).toBeUndefined();
  });
});

describe('isValidJsonString', () => {
  it('returns true for a valid JSON string', () => {
    const jsonString = '{"key": "value"}';
    const result = isValidJsonString(jsonString);
    expect(result).toBe(true);
  });

  it('returns false for an invalid JSON string', () => {
    const invalidJsonString = '{"key": "value"';
    const result = isValidJsonString(invalidJsonString);
    expect(result).toBe(false);
  });
});
