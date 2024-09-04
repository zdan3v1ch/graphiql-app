'use client';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { Add } from '@mui/icons-material';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IHeaders {
  key: string;
  value: string;
}

export default function Headers() {
  const { t } = useTranslation(Namespaces.CLIENTS);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getHeaders = useMemo(() => {
    const headers: IHeaders[] = [];
    searchParams.forEach((value, key) => headers.push({ key, value }));
    return headers;
  }, [searchParams]);
  const [headers, setHeaders] = useState<IHeaders[]>(getHeaders);
  const createQueryString = useCallback((headers: IHeaders[]) => {
    const params = new URLSearchParams(
      headers.map((header) => [header.key, header.value])
    );
    return params.toString();
  }, []);

  const handleOnClick = useCallback(() => {
    setHeaders((headers) => [...headers, { key: '', value: '' }]);
  }, []);

  const handleOnChange = useCallback(
    (index: number, property: keyof IHeaders) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newHeaders = headers.map((header, i) => {
          if (i === index) {
            const newValue = headers[index];
            newValue[property] = event.target.value;
            return newValue;
          } else return headers[i];
        });
        setHeaders(newHeaders);
        router.push(pathname + '?' + createQueryString(newHeaders));
      },
    [createQueryString, headers, pathname, router]
  );

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2}>
        <Typography>{t('headers')}</Typography>
        <Button onClick={handleOnClick} startIcon={<Add />}>
          {t('add')}
        </Button>
      </Stack>
      {headers.length > 0 &&
        headers.map((header, index) => (
          <Stack key={`${index}`} direction="row" spacing={2}>
            <TextField
              value={header.key}
              variant="outlined"
              onChange={handleOnChange(index, 'key')}
            />
            <TextField
              value={header.value}
              variant="outlined"
              onChange={handleOnChange(index, 'value')}
            />
          </Stack>
        ))}
    </Stack>
  );
}
