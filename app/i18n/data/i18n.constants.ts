import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { Config } from 'next-i18n-router/dist/types';

export const namespaces = Object.values(Namespaces);
export const defaultNS = namespaces[0];

export const languages: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
};
export const locales = Object.keys(languages);

export const i18nConfig: Config = {
  locales,
  defaultLocale: locales[0],
  localeCookie: 'graphiqlLocale',
  prefixDefault: true,
};

export const COOKIE_STORAGE_DAYS = 30;
