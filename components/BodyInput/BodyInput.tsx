'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@mui/material';

import { Namespaces } from '@/app/i18n/data/i18n.enum';

interface Props {
  body: string;
  onBodyChange: (body: string) => void;
}

const BodyInput: React.FC<Props> = ({ body, onBodyChange }) => {
  const { t } = useTranslation(Namespaces.CLIENTS);

  const [bodyValue, setBodyValue] = useState<string>(body);

  return (
    <>
      <Typography>{t('body')}</Typography>
      <TextField
        key="BodyInput"
        value={bodyValue}
        variant="outlined"
        onChange={(event) => {
          setBodyValue(event.target.value);
        }}
        onBlur={() => {
          onBodyChange(bodyValue);
        }}
      />
    </>
  );
};

export default BodyInput;
