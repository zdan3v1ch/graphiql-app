'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import {
  Content,
  isMenuButton,
  MenuItem,
  Mode,
  toTextContent,
} from 'vanilla-jsoneditor';
import styles from './CustomJsonEditor.module.css';
const CustomJsonEditor = dynamic(() => import('./CustomJsonEditor'), {
  ssr: false,
});

interface Props {
  body: string;
  onBodyChange: (body: string) => void;
}

const BodyInput: React.FC<Props> = ({ body, onBodyChange }) => {
  const { t } = useTranslation(Namespaces.CLIENTS);

  const [bodyValue, setBodyValue] = useState<Content>({ json: body });

  const handleOnChange = useCallback((content: Content) => {
    setBodyValue(content);
  }, []);
  const onRenderMenu = useCallback((items: MenuItem[]) => {
    const regex = /((Format|Compact) JSON)/gm;
    const newItems: MenuItem[] = items.filter(
      (item) => isMenuButton(item) && typeof item.title === 'string' && item.title.match(regex)
    );
    return newItems;
  }, []);

  return (
    <div className={styles.wrapper}>
      <Typography>{t('body')}</Typography>
      <CustomJsonEditor
        mode={Mode.text}
        content={bodyValue}
        onChange={handleOnChange}
        onBlur={() => {
          const textContent = toTextContent(bodyValue);
          if (textContent && typeof textContent.text === 'string') {
            onBodyChange(textContent.text);
          }
        }}
        onRenderMenu={onRenderMenu}
      />
    </div>
  );
};

export default BodyInput;
