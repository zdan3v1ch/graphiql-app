'use client';

import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { Store } from '@/lib/localStorage/localStorage';
import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';
import NavButton from '@/components/NavButton';
import { Session } from 'next-auth';

export default function History({ session }: { session: Session | null }) {
  const { t } = useTranslation(Namespaces.HISTORY);
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    setRequests(Store.getRequests(session?.user?.email).reverse());
  }, [session?.user?.email]);

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
    <Stack className="flow">
      <Typography variant="h1">{t('history')}</Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
      >
        {requests.map((request, index) => {
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

          return (
            <NavButton
              key={`${request}${index}`}
              label={`${method} ${endpointUrl}`}
              url={request}
              buttonProps={{
                variant: 'text',
                color: 'primary',
              }}
            />
          );
        })}
      </Box>
    </Stack>
  );
}
