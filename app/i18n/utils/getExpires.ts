import { COOKIE_STORAGE_DAYS } from '@/app/i18n/data/i18n.constants';

export function getExpires() {
  const days = COOKIE_STORAGE_DAYS;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  return date.toUTCString();
}
