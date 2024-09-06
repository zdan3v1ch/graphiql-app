'use client';

import { useTranslation } from 'react-i18next';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

import { Namespaces } from '@/app/i18n/data/i18n.enum';

interface Props {
  headers: [string, string][];
  onHeadersChange: (headers: [string, string][]) => void;
}

const HeadersInput: React.FC<Props> = ({ headers, onHeadersChange }) => {
  const { t } = useTranslation(Namespaces.CLIENTS);

  const addHeader = () => {
    const newHeaders: [string, string][] = [...headers, ['', '']];

    onHeadersChange(newHeaders);
  };

  const changeHeader = (index: number, key: string, value: string) => {
    const newHeaders: [string, string][] = [
      ...headers.slice(0, index),
      [key, value],
      ...headers.slice(index + 1),
    ];

    onHeadersChange(newHeaders);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={2}>
        <Typography>{t('headers')}</Typography>
        <Button
          onClick={() => {
            addHeader();
          }}
          startIcon={<Add />}
        >
          {t('add')}
        </Button>
      </Stack>
      {!!headers.length &&
        headers.map(([key, value], index) => (
          <Stack key={index} direction="row" spacing={2}>
            <TextField
              value={key}
              variant="outlined"
              onChange={(event) => {
                changeHeader(index, event.target.value, value);
              }}
            />
            <TextField
              value={value}
              variant="outlined"
              onChange={(event) => {
                changeHeader(index, key, event.target.value);
              }}
            />
          </Stack>
        ))}
    </Stack>
  );
};

export default HeadersInput;
