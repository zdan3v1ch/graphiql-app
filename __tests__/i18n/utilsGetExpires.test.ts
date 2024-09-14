import { getExpires } from "@/app/i18n/utils/getExpires";
import { COOKIE_STORAGE_DAYS } from '@/app/i18n/data/i18n.constants';

describe('Given getExpires function', () => {
  test('Function return valid value', () => {
    const result = getExpires();

    expect(Date.parse(result)).toBeGreaterThan(Date.now());
    expect(Date.parse(result)).toBeLessThan(Date.now() + COOKIE_STORAGE_DAYS * 24 * 60 * 60 * 1000);
  });
});
