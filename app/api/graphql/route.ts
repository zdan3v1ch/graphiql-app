import { NextRequest, NextResponse } from 'next/server';
import { getIntrospectionQuery } from 'graphql';
import z from 'zod';

import { parseGraphiQlUrl } from '@/app/utils';
import { ApiResponse, GraphqlSdlResponse } from '@/app/model';

export async function GET(
  request: NextRequest
): Promise<NextResponse<GraphqlSdlResponse>> {
  const introspectionQuery = getIntrospectionQuery();
  const sdlUrl = request.nextUrl.searchParams.get('sdlUrl');

  if (!sdlUrl) {
    return NextResponse.json(
      { error: 'SDL schema URL is required' },
      { status: 400 }
    );
  }

  const { data: graphqlSdlUrl, error: validationError } = z
    .string()
    .min(1)
    .safeParse(sdlUrl);

  if (validationError) {
    return NextResponse.json(
      { error: validationError.message },
      { status: 400 }
    );
  }

  try {
    const graphqlSdlResponse = await fetch(graphqlSdlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    });

    const responseContentType = graphqlSdlResponse.headers.get('content-type');
    let data: unknown;

    if (responseContentType?.includes('application/json')) {
      data = await graphqlSdlResponse.json();
    } else {
      return NextResponse.json(
        { error: 'Invalid SDL schema URL' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unexpected error';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  const clientRequestBody: unknown = await request.json();
  const { data: graphiqlUrl, error: validationError } = z
    .string()
    .min(1)
    .safeParse(clientRequestBody);

  if (validationError) {
    return NextResponse.json(
      { error: validationError.message },
      { status: 400 }
    );
  }

  const { endpointUrl, headers, body } = parseGraphiQlUrl(graphiqlUrl);

  if (!endpointUrl) {
    return NextResponse.json(
      { error: 'Endpoint url is required' },
      { status: 400 }
    );
  }

  try {
    const graphqlResponse = await fetch(endpointUrl, {
      method: 'POST',
      headers: { ...headers, 'Content-type': 'application/json' },
      body,
    });

    const responseContentType = graphqlResponse.headers.get('content-type');
    let data: unknown;

    if (responseContentType?.includes('application/json')) {
      data = await graphqlResponse.json();
    } else {
      data = await graphqlResponse.text();
    }

    return NextResponse.json({
      status: graphqlResponse.status,
      data,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unexpected error';
    const status = err instanceof Error && err.name === 'TypeError' ? 400 : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
