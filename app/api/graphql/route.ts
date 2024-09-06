import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

import { parseGraphqlClientUrl } from '@/app/utils';

export async function POST(request: NextRequest) {
  const clientRequestBody: unknown = await request.json();
  const { data: restfulClientUrl, error: validationError } = z
    .string()
    .min(1)
    .safeParse(clientRequestBody);

  if (validationError) {
    return NextResponse.json({ error: validationError.message });
  }

  const { endpointUrl, headers, body } =
    parseGraphqlClientUrl(restfulClientUrl);

  if (!endpointUrl) {
    return NextResponse.json({
      error: 'Endpoint url is required',
      status: 400,
    });
  }

  const restfulResponse = await fetch(endpointUrl, {
    method: 'POST',
    headers,
    body,
  });
  const restfulData: unknown = await restfulResponse.json();

  return NextResponse.json({
    status: restfulResponse.status,
    data: restfulData,
  });
}
