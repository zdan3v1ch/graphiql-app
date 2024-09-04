'use client';

import { EMPTY_ENDPOINT } from '@/app/[lng]/[...method]/constants';
import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { TextField, Typography } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function EndpointInput() {
  const { t } = useTranslation(Namespaces.CLIENTS);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const oldBody = decodeURIComponent(params.method[2]);
  console.log(params.method[2]);
  const [body, setBody] = useState(params.method[2] ? atob(oldBody) : '');
  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBody(event.target.value);
    },
    []
  );

  const handleOnFocusOut = useCallback(() => {
    let newURL = '/';
    newURL = newURL.concat(
      params.method[0],
      '/',
      params.method[1]
        ? decodeURIComponent(params.method[1])
        : btoa(EMPTY_ENDPOINT),
      `/${btoa(body)}`
    );
    searchParams
      ? router.push(newURL.concat('?', searchParams.toString()))
      : router.push(newURL);
  }, [body, params.method, router, searchParams]);

  return (
    <>
      <Typography>{t('body')}</Typography>
      <TextField
        key="BodyInput"
        value={body}
        variant="outlined"
        onChange={handleOnChange}
        onBlur={handleOnFocusOut}
      />
    </>
  );
}
