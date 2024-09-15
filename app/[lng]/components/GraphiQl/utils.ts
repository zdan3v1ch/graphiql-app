import z from 'zod';

export interface GraphqlBody {
  query: string;
  variables: object | string;
}

export function parseGraphqlBody(body: string): GraphqlBody {
  let queryJson: string;
  let variablesJson: object | string;

  try {
    const bodyJson: unknown = JSON.parse(body);

    const { data: dataQuery } = z
      .object({
        query: z.string().optional(),
      })
      .safeParse(bodyJson);
    const { data: dataVariables } = z
      .object({
        variables: z.record(z.any()).optional(),
      })
      .safeParse(bodyJson);

    queryJson = dataQuery?.query ?? '';
    variablesJson = dataVariables?.variables ?? '';
  } catch (error) {
    queryJson = '';
    variablesJson = '';
  }

  return { query: queryJson, variables: variablesJson };
}
