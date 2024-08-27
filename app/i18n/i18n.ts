import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultNS, i18nConfig } from '@/app/i18n/data/i18n.constants';
import { IInitI18n } from '@/app/i18n/data/i18n.interface';

export async function initI18n({
  language,
  namespaces,
  i18nInst,
  resources,
}: IInitI18n) {
  const i18nInstance = i18nInst ?? createInstance();
  i18nInstance.use(initReactI18next);
  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    );
  }
  await i18nInstance.init({
    lng: language,
    fallbackLng: i18nConfig.locales[0],
    supportedLngs: i18nConfig.locales,
    defaultNS: defaultNS,
    fallbackNS: defaultNS,
    ns: namespaces,
    resources,
    preload: resources ? [] : i18nConfig.locales,
  });
  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
