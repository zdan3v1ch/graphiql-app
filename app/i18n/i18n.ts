import { createInstance, FlatNamespace, KeyPrefix } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultNS, fallbackLng, i18nConfig } from '@/app/i18n/i18n.constants';
import { FallbackNs } from 'react-i18next';

const initI18next = async (
  language: string,
  namespace: string | string[] = defaultNS
) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: language,
      fallbackLng: fallbackLng,
      supportedLngs: i18nConfig.locales,
      defaultNS: defaultNS,
      fallbackNS: defaultNS,
      ns: namespace,
    });
  return i18nInstance;
};

export async function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(language: string, namespace?: Ns, options: { keyPrefix?: KPrefix } = {}) {
  const i18nextInstance = await initI18next(
    language,
    Array.isArray(namespace) ? (namespace as string[]) : (namespace as string)
  );
  return {
    t: i18nextInstance.getFixedT(language, namespace, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
