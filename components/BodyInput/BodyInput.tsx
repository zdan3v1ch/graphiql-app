'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

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

interface Props {
  body: string;
  onBodyChange: (body: string) => void;
}

const BodyInput: React.FC<Props> = ({ body, onBodyChange }) => {
  const { t } = useTranslation(Namespaces.CLIENTS);

  const [bodyValue, setBodyValue] = useState<Content>({ text: body });

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
    <div className={styles.editorWrapper}>
      <Typography>{t('body')}</Typography>
      <JsonEditor
        mode={Mode.text}
        content={bodyValue}
        onChange={handleOnChange}
        onBlur={() => {
          onBodyChange(toTextContent(bodyValue).text);
        }}
        onRenderMenu={onRenderMenu}
      />
    </div>
  );
};

export default BodyInput;
