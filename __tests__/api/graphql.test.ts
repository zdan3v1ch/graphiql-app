/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/graphql/route';
import { NextRequest, NextResponse } from 'next/server';
import { parseGraphiQlUrl } from '@/app/utils';

jest.mock('@/app/utils', () => ({
  parseGraphiQlUrl: jest.fn(),
}));
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));
global.fetch = jest.fn();

const mockNextResponse = jest
  .spyOn(NextResponse, 'json')
  .mockImplementation(jest.fn());

describe('GET function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if sdlUrl is missing', async () => {
    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams() },
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'SDL schema URL is required' },
      { status: 400 }
    );
  });

  it('should return 400 if sdlUrl is invalid', async () => {
    const mockRequest = {
      nextUrl: { searchParams: new URLSearchParams({ sdlUrl: '' }) },
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(expect.any(Object), {
      status: 400,
    });
  });

  it('should return data when GraphQL request succeeds', async () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ sdlUrl: 'http://example.com' }),
      },
    } as unknown as NextRequest;

    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: jest.fn().mockReturnValue('application/json') },
      json: jest.fn().mockResolvedValueOnce({ data: 'GraphQL SDL data' }),
    });

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith({
      data: 'GraphQL SDL data',
    });
  });

  it('should return 400 if response content-type is not JSON', async () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ sdlUrl: 'http://example.com' }),
      },
    } as unknown as NextRequest;

    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: jest.fn().mockReturnValue('text/html') },
    });

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'Invalid SDL schema URL' },
      { status: 400 }
    );
  });

  it('should return 500 if fetch throws an error', async () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ sdlUrl: 'http://example.com' }),
      },
    } as unknown as NextRequest;

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    await GET(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'Fetch failed' },
      { status: 500 }
    );
  });
});

describe('POST function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if body is invalid', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValueOnce(''),
    } as unknown as NextRequest;

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(expect.any(Object), {
      status: 400,
    });
  });

  it('should return 400 if endpointUrl is missing', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValueOnce('http://invalid-url'),
    } as unknown as NextRequest;

    (parseGraphiQlUrl as jest.Mock).mockReturnValueOnce({
      endpointUrl: '',
    });

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'Endpoint url is required' },
      { status: 400 }
    );
  });

  it('should return data when GraphQL request succeeds', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValueOnce('http://valid-url'),
    } as unknown as NextRequest;

    (parseGraphiQlUrl as jest.Mock).mockReturnValueOnce({
      endpointUrl: 'http://valid-url',
      headers: {},
      body: '{}',
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      headers: { get: jest.fn().mockReturnValue('application/json') },
      json: jest.fn().mockResolvedValueOnce({ data: 'GraphQL data' }),
      status: 200,
    });

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith({
      status: 200,
      data: { data: 'GraphQL data' },
    });
  });

  it('should return 500 if fetch throws an error', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValueOnce('http://valid-url'),
    } as unknown as NextRequest;

    (parseGraphiQlUrl as jest.Mock).mockReturnValueOnce({
      endpointUrl: 'http://valid-url',
      headers: {},
      body: '{}',
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    await POST(mockRequest);

    expect(mockNextResponse).toHaveBeenCalledWith(
      { error: 'Fetch failed' },
      { status: 500 }
    );
  });
});
