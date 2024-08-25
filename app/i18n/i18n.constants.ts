import { Config } from 'next-i18n-router/dist/types';

export const fallbackLng = 'en';
export const defaultNS = 'main';

export const i18nConfig: Config = {
  locales: [fallbackLng, 'ru'],
  defaultLocale: fallbackLng,
  localeCookie: 'graphiqlLocale',
  prefixDefault: true,
};
