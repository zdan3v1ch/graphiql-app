'use client';
import { usePathname } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { Store } from '@/lib/localStorage/localStorage';
import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';
import NavButton from '@/components/NavButton';
import { locales } from '@/app/i18n/data/i18n.constants';
import { Session } from 'next-auth';

export default function History({ session }: { session: Session | null }) {
  const { t, i18n } = useTranslation(Namespaces.HISTORY);
  const pathname = usePathname();
  const requests = Store.getRequests(session?.user?.email);

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
          let [method, base64EncodedEndpointUrl] = ['', ''];
          mainPart.startsWith('/')
            ? ([, method, base64EncodedEndpointUrl] = mainPart.split('/'))
            : ([method, base64EncodedEndpointUrl] = mainPart.split('/'));

          const endpointUrl = base64EncodedEndpointUrl
            ? decodeURI(
                Buffer.from(base64EncodedEndpointUrl, 'base64').toString(
                  'utf-8'
                )
              )
            : '';

          let newUrl = regex.test(pathname)
            ? pathname.slice(0, 1 + i18n.language.length)
            : '';
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
