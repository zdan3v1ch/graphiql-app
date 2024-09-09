'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Stack, Typography } from '@mui/material';

import JsonEditor from '@/components/JsonEditor/JsonEditor';
import styles from './BodyInput.module.css';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import {
  Content,
  isMenuButton,
  MenuItem,
  Mode,
  toTextContent,
} from 'vanilla-jsoneditor';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

interface Props {
  body: string;
  onBodyChange: (body: string) => void;
  namespace: boolean;
  variable?: boolean;
}

const BodyInput: React.FC<Props> = ({ body, onBodyChange, namespace, variable }) => {
  const { t } = useTranslation(namespace ? Namespaces.CLIENTS : Namespaces.GRAPHQL );
  const [isVisible, setIsVisible] = useState<boolean>(!!body);
  const [bodyValue, setBodyValue] = useState<Content>({ text: body });
  const variableInput = variable ? t('variablesGraphql') : t('queryGraphql');

  const handleOnChange = useCallback((content: Content) => {
    setBodyValue(content);
  }, []);
  const onRenderMenu = useCallback((items: MenuItem[]) => {
    const regex = /((Format|Compact) JSON)/gm;

    return items.filter(
      (item) => isMenuButton(item) && item.title?.match(regex)
    );
  }, []);

  return (
    <Stack className={styles.editorWrapper} spacing={2}>
      <Box display="flex" gap={1} alignItems="center">
        <Typography component="h2" variant="h5">
          {namespace ? t('body') : variableInput}
        </Typography>
        <IconButton
          onClick={() => {
            setIsVisible((isVisible) => !isVisible);
          }}
        >
          {isVisible ? <ArrowDropUp /> : <ArrowDropDown />}
        </IconButton>
      </Box>
      {isVisible && (
        <JsonEditor
          mode={Mode.text}
          content={bodyValue}
          onChange={handleOnChange}
          onBlur={() => {
            onBodyChange(toTextContent(bodyValue).text);
          }}
          onRenderMenu={onRenderMenu}
        />
      )}
    </Stack>
  );
};

export default BodyInput;
