'use client';

import { RESTClient } from '@/app/[lng]/[...method]/components/RESTClient';
import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { useTranslation } from 'react-i18next';

export default function APIClient() {
  const { t } = useTranslation(Namespaces.CLIENTS);
  return (
    <>
      <h1>{t('restClient')}</h1>
      <RESTClient />
    </>
  );
}
