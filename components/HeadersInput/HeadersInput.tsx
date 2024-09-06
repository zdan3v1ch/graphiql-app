'use client';

import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Add, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { useState } from 'react';

interface Props {
  title: string;
  headers: [string, string][];
  onHeadersChange: (headers: [string, string][]) => void;
}

const HeadersInput: React.FC<Props> = ({ title, headers, onHeadersChange }) => {
  const { t } = useTranslation(Namespaces.CLIENTS);
  const [isVisible, setIsVisible] = useState(true);

  const addHeader = () => {
    const newHeaders: [string, string][] = [...headers, ['', '']];

    onHeadersChange(newHeaders);
  };
  const onChangeVisible = () => {
    setIsVisible((isVisible) => !isVisible);
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
        <Typography>{t(title)}</Typography>
        <Button
          onClick={onChangeVisible}
          startIcon={isVisible ? <ArrowDropDown /> : <ArrowDropUp />}
        />
      </Stack>
      {isVisible && (
        <Box>
          <Button
            onClick={() => {
              addHeader();
            }}
            startIcon={<Add />}
          >
            {t(`${title}Add`)}
          </Button>
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
        </Box>
      )}
    </Stack>
  );
};

export default HeadersInput;
