import { validateRequestData, variableSubstitute } from "@/app/[lng]/components/RestClient/utils";

describe('Given RestClient utils function', () => {
  test('Function variableSubstitute return valid value', () => {
    const result = variableSubstitute('{{test}}value', [['test', 'substitute']]);

    expect(result).toBe('substitutevalue');
  });
  test('Function validateRequestData return valid value', () => {
    const result = validateRequestData({ method: 'GET', endpointUrl: 'Endpoint', headers: {'Key': 'Value'}, body: 'Body' });

    expect(result).toStrictEqual( {validParsedMethod: 'GET',
      validParsedEndpointUrl: 'Endpoint',
      validParsedHeaders: {'Key': 'Value'},
      validParsedBody: 'Body'});
  });
});

