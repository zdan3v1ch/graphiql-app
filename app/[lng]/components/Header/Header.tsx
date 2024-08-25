import { useTranslation } from '@/app/i18n/i18n';
import { i18nConfig } from '@/app/i18n/i18n.constants';
import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';

export async function Header({ lng }: { lng: string }) {
  const { t } = await useTranslation(lng, 'header');
  return (
    <>
      <Trans i18nKey="languageSwitcher" t={t}>
        {t('switch')}
        <strong>{lng}</strong> to:{' '}
      </Trans>
      {i18nConfig.locales
        .filter((l) => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && ' or '}
              <Link href={`/${l}`}>{l}</Link>
            </span>
          );
        })}
    </>
  );
}
