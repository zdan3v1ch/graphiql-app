import { validateJson } from '@/components/JsonEditor/utils';

describe('Given validateJson component', () => {
  test('When empty string, return empty array', () => {
    const result = validateJson('');

    expect(result.length).toBe(0);
  });
  test('When valid json string, return empty array', () => {
    const result = validateJson('{"ff" : 5}');

    expect(result.length).toBe(0);
  });
  test('When no valid json string, return error', () => {
    const result = validateJson('"ff""test"');

    expect(result.length).not.toBe(0);
  });
});
