import { i18n, Resource } from 'i18next';

export interface Params {
  lng: string;
}
interface II18n {
  language: string;
  namespaces: string | string[];
  resources?: Resource;
}

export interface IInitI18n extends II18n {
  i18nInst?: i18n;
}

export interface IProviderI18n extends II18n {
  children: React.ReactNode;
}
