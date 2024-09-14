/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';

import { POST } from '@/app/api/restful/route';
import { parseRestfulClientUrl } from '@/app/utils';

jest.mock('@/app/utils', () => ({
  parseRestfulClientUrl: jest.fn(),
}));

global.fetch = jest.fn();

describe('POST function', () => {
  let mockRequest: Partial<NextRequest>;
  const mockNextResponse = jest
    .spyOn(NextResponse, 'json')
    .mockImplementation(jest.fn());

  beforeEach(() => {
    mockRequest = {
      json: jest.fn(),
    };
    jest.spyOn(NextResponse, 'json').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when body is invalid', async () => {
    mockRequest.json = jest.fn().mockResolvedValue('');

    await POST(mockRequest as NextRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(expect.any(Object), {
      status: 400,
    });
  });

  it('should return 400 when endpointUrl is missing', async () => {
    const restfulClientUrl = 'test-url';
    (parseRestfulClientUrl as jest.Mock).mockReturnValue({
      method: 'GET',
      endpointUrl: null,
      headers: {},
      body: null,
    });

    mockRequest.json = jest.fn().mockResolvedValue(restfulClientUrl);

    await POST(mockRequest as NextRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'Endpoint url is required' },
      { status: 400 }
    );
  });

  it('should make a fetch request and return the result', async () => {
    const restfulClientUrl = 'test-url';
    (parseRestfulClientUrl as jest.Mock).mockReturnValue({
      method: 'POST',
      endpointUrl: 'https://example.com',
      headers: {},
      body: 'some body',
    });

    mockRequest.json = jest.fn().mockResolvedValue(restfulClientUrl);

    const mockFetchResponse = {
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValue({ success: true }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

    await POST(mockRequest as NextRequest);

    expect(fetch).toHaveBeenCalledWith('https://example.com', {
      method: 'POST',
      headers: {},
      body: 'some body',
    });
    expect(mockNextResponse).toHaveBeenCalledWith({
      status: 200,
      data: { success: true },
    });
  });

  it('should handle fetch errors', async () => {
    const restfulClientUrl = 'test-url';
    (parseRestfulClientUrl as jest.Mock).mockReturnValue({
      method: 'GET',
      endpointUrl: 'https://example.com',
      headers: {},
      body: null,
    });

    mockRequest.json = jest.fn().mockResolvedValue(restfulClientUrl);

    (fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    await POST(mockRequest as NextRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'Fetch failed' },
      { status: 500 }
    );
  });
});
