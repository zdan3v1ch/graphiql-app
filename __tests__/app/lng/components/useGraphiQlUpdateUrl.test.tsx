import { renderHook } from '@testing-library/react';
import useUpdateUrl from '@/app/[lng]/components/GraphiQl/hooks/useUpdateUrl';
import { EMPTY_ENDPOINT_URL_SYMBOL } from '@/app/constants';
import { isValidJsonString } from '@/app/utils';

global.btoa = jest.fn((input: string) => `encoded-${input}`);
const mockHistoryPushState = jest.spyOn(global.history, 'pushState');
jest.mock('@/app/utils', () => ({
  isValidJsonString: jest.fn(),
}));

describe('useUpdateUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should construct and push a new URL when endpointUrl is provided', () => {
    const endpointUrl = 'https://example.com/graphql';
    const pathname = '/en/graphql';

    renderHook(() => useUpdateUrl(endpointUrl, [], pathname, 2, '', ''));

    expect(global.btoa).toHaveBeenCalledWith(endpointUrl);
    expect(mockHistoryPushState).toHaveBeenCalledWith(
      null,
      '',
      '/en/GRAPHQL/encoded-https://example.com/graphql'
    );
  });

  it('should add query and variables to the URL when provided', () => {
    const query = '{ hello }';
    const variables = '{"name":"world"}';
    (isValidJsonString as jest.Mock).mockReturnValue(true);

    renderHook(() => useUpdateUrl('', [], '/en/graphql', 2, query, variables));

    const encodedBody = window.btoa(
      encodeURI(JSON.stringify({ query, variables: { name: 'world' } }))
    );

    expect(mockHistoryPushState).toHaveBeenCalledWith(
      null,
      '',
      `/en/GRAPHQL/${EMPTY_ENDPOINT_URL_SYMBOL}/${encodedBody}`
    );
  });

  it('should add headers to the URL when headers are provided', () => {
    const headers: [string, string][] = [
      ['Authorization', 'Bearer token'],
      ['Content-Type', 'application/json'],
    ];

    renderHook(() => useUpdateUrl('', headers, '/en/graphql', 2, '', ''));

    expect(mockHistoryPushState).toHaveBeenCalledWith(
      null,
      '',
      '/en/GRAPHQL/?Authorization=Bearer%20token&Content-Type=application%2Fjson'
    );
  });

  it('should handle empty endpointUrl and still construct the URL', () => {
    renderHook(() => useUpdateUrl('', [], '/en/graphql', 2, '', ''));

    expect(mockHistoryPushState).toHaveBeenCalledWith(null, '', `/en/GRAPHQL/`);
  });

  it('should handle locale not present in pathname', () => {
    const pathname = '/somepath';

    renderHook(() => useUpdateUrl('', [], pathname, 2, '', ''));

    expect(mockHistoryPushState).toHaveBeenCalledWith(null, '', `/GRAPHQL/`);
  });

  it('should parse variables only if valid JSON string', () => {
    const variables = '{"key":"value"}';
    (isValidJsonString as jest.Mock).mockReturnValue(true);

    renderHook(() => useUpdateUrl('', [], '/en/graphql', 2, '', variables));

    const encodedBody = window.btoa(
      encodeURI(JSON.stringify({ variables: { key: 'value' } }))
    );

    expect(global.btoa).toHaveBeenCalledWith(
      encodeURI(JSON.stringify({ variables: { key: 'value' } }))
    );
    expect(mockHistoryPushState).toHaveBeenCalledWith(
      null,
      '',
      `/en/GRAPHQL/${EMPTY_ENDPOINT_URL_SYMBOL}/${encodedBody}`
    );
  });

  it('should handle invalid JSON in variables', () => {
    const variables = '{"key":"value"';
    (isValidJsonString as jest.Mock).mockReturnValue(false);

    renderHook(() => useUpdateUrl('', [], '/en/graphql', 2, '', variables));

    const encodedBody = window.btoa(
      encodeURI(JSON.stringify({ variables: {} }))
    );

    expect(mockHistoryPushState).toHaveBeenCalledWith(
      null,
      '',
      `/en/GRAPHQL/${EMPTY_ENDPOINT_URL_SYMBOL}/${encodedBody}`
    );
  });
});
