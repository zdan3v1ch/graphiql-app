import { parseGraphqlBody } from '@/app/[lng]/components/GraphiQl/utils';

describe('parseGraphqlBody', () => {
  it('should correctly parse a valid GraphQL body with both query and variables', () => {
    const body = JSON.stringify({
      query: 'query { users { id name } }',
      variables: { id: 1 },
    });

    const result = parseGraphqlBody(body);

    expect(result.query).toBe('query { users { id name } }');
    expect(result.variables).toEqual({ id: 1 });
  });

  it('should correctly parse a valid GraphQL body with query but without variables', () => {
    const body = JSON.stringify({
      query: 'query { users { id name } }',
    });

    const result = parseGraphqlBody(body);

    expect(result.query).toBe('query { users { id name } }');
    expect(result.variables).toBe('');
  });

  it('should return empty strings when parsing an invalid JSON string', () => {
    const invalidBody = '{ query: query { users { id name } }, }';

    const result = parseGraphqlBody(invalidBody);

    expect(result.query).toBe('');
    expect(result.variables).toBe('');
  });

  it('should return empty strings when required fields are missing', () => {
    const body = JSON.stringify({
      someOtherField: 'value',
    });

    const result = parseGraphqlBody(body);

    expect(result.query).toBe('');
    expect(result.variables).toBe('');
  });

  it('should handle a body with only variables and no query', () => {
    const body = JSON.stringify({
      variables: { id: 1 },
    });

    const result = parseGraphqlBody(body);

    expect(result.query).toBe('');
    expect(result.variables).toEqual({ id: 1 });
  });

  it('should handle an empty JSON object', () => {
    const body = JSON.stringify({});

    const result = parseGraphqlBody(body);

    expect(result.query).toBe('');
    expect(result.variables).toBe('');
  });
});
