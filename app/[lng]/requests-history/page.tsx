'use client';
import { usePathname } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { TSessionContextValue } from '@/auth/SessionDataProvider/SessionDataProvider';
import { useSessionData } from '@/auth/SessionDataProvider/useSessionData';
import { Store } from '@/lib/localStorage/localStorage';
import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';
import NavButton from '@/components/NavButton';
import { locales } from '@/app/i18n/data/i18n.constants';

export default function History() {
  const { t, i18n } = useTranslation(Namespaces.HISTORY);
  const pathname = usePathname();
  const sessionContent: TSessionContextValue = useSessionData();
  const requests = Store.getRequests(sessionContent.data?.user?.id);

  if (!requests.length) {
    return (
      <>
        <div>{t('emptyHistory')}</div>
        {protectedNavButtonParams.map(
          (params) =>
            (params.labelHeaderNsKey === 'navRestfulClient' ||
              params.labelHeaderNsKey === 'navGraphqlClient') && (
              <NavButton
                key={`${params.labelHeaderNsKey}${params.url}1`}
                label={t(params.labelHeaderNsKey, { ns: Namespaces.HEADER })}
                url={params.url}
                buttonProps={{
                  variant: 'contained',
                  color: 'primary',
                }}
              />
            )
        )}
      </>
    );
  }
  return (
    <>
      <Typography variant="h4">{t('history')}</Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={2}
      >
        {requests.map((request) => {
          const localePattern = locales.join('|');
          const regex = new RegExp(`^/(${localePattern})/(.*)`);
          const mainPart = request.split('?')[0] ?? '';
          const [method, base64EncodedEndpointUrl] = mainPart.split('/');
          const endpointUrl = base64EncodedEndpointUrl
            ? Buffer.from(base64EncodedEndpointUrl, 'base64').toString('utf-8')
            : '';

          let newUrl = regex.test(pathname)
            ? pathname.slice(0, 1 + i18n.language.length + 1)
            : '/';
          newUrl += request;
          return (
            <NavButton
              key={request}
              label={`${method} ${endpointUrl}`}
              url={newUrl}
              buttonProps={{
                variant: 'text',
                color: 'primary',
              }}
            />
          );
        })}
      </Box>
    </>
  );
}
