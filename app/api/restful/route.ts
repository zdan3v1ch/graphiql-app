import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

import { parseRestfulClientUrl } from '@/app/utils';
import { ApiResponse } from '@/app/model';

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  const clientRequestBody: unknown = await request.json();
  const { data: restfulClientUrl, error: validationError } = z
    .string()
    .min(1)
    .safeParse(clientRequestBody);

  if (validationError) {
    return NextResponse.json(
      { error: validationError.message },
      { status: 400 }
    );
  }

  const reqData = parseRestfulClientUrl(restfulClientUrl);
  const { method, endpointUrl, headers, body } = reqData;

  if (!endpointUrl) {
    return NextResponse.json(
      { error: 'Endpoint url is required' },
      { status: 400 }
    );
  }

  try {
    const restfulResponse = await fetch(endpointUrl, {
      method,
      headers,
      body,
    });

    const responseContentType = restfulResponse.headers.get('content-type');
    let data: unknown;

    if (responseContentType?.includes('application/json')) {
      data = await restfulResponse.json();
    } else {
      data = await restfulResponse.text();
    }

    return NextResponse.json({
      status: restfulResponse.status,
      data,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unexpected error';
    const status = err instanceof Error && err.name === 'TypeError' ? 400 : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
