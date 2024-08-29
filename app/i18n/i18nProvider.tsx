'use client';

import { I18nextProvider } from 'react-i18next';
import { initI18n } from '@/app/i18n/i18n';
import { IProviderI18n } from '@/app/i18n/data/i18n.interface';
import { createInstance } from 'i18next';

export default function I18nProvider({
  children,
  language,
  namespaces,
  resources,
}: IProviderI18n) {
  const i18nInst = createInstance();
  void initI18n({ language, namespaces, i18nInst, resources });

  return <I18nextProvider i18n={i18nInst}>{children}</I18nextProvider>;
}
