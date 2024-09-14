import { getResponseStatusColor } from '@/components/ApiResponseViewer/utils';

describe('Given getResponseStatusColor component', () => {
  test('When status >=100 < 200 should return "lightblue"', () => {
    const result = getResponseStatusColor(101);

    expect(result).toBe('lightblue');
  });
  test('When status >=200 < 300 should return "green"', () => {
    const result = getResponseStatusColor(201);

    expect(result).toBe('green');
  });
  test('When status >=300 < 400 should return "orange"', () => {
    const result = getResponseStatusColor(301);

    expect(result).toBe('orange');
  });
  test('When status >=400 < 500 should return "red"', () => {
    const result = getResponseStatusColor(401);

    expect(result).toBe('red');
  });
  test('When status >=500 < 600 should return "darkred"', () => {
    const result = getResponseStatusColor(501);

    expect(result).toBe('darkred');
  });
  test('When status <100 or >=600 should return "gray"', () => {
    const result = getResponseStatusColor(99);

    expect(result).toBe('gray');
  });
});
