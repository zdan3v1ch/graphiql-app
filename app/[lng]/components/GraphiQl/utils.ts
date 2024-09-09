import z from 'zod';

export interface GraphqlBody {
  query: string;
  variables: string;
}

export function parseGraphqlBody(body: string): GraphqlBody {
  let queryJson: string;
  let variablesJson: string;

  try {
    const bodyJson: unknown = JSON.parse(body);

    const { data } = z
      .object({
        query: z.string().optional(),
        variables: z.string().optional(),
      })
      .safeParse(bodyJson);

    queryJson = data?.query ?? '';
    variablesJson = data?.variables ?? '';
  } catch (error) {
    queryJson = '';
    variablesJson = '';
  }

  return { query: queryJson, variables: variablesJson };
}
