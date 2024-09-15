'use client';

import useGetAllSearchParams from '../../hooks/useGetAllSearchParams';
import { i18nConfig, languages } from '@/app/i18n/data/i18n.constants';
import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { getExpires } from '@/app/i18n/utils/getExpires';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation(Namespaces.HEADER);
  const currentLanguage = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParamsString = useGetAllSearchParams();

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newLocale = event.target.value;
      document.cookie = `${i18nConfig.localeCookie}=${newLocale};expires=${getExpires()};path=/`;
      router.push(
        currentPathname
          .replace(`/${currentLanguage}`, `/${newLocale}`)
          .concat('?', searchParamsString)
      );
      router.refresh();
    },
    [currentLanguage, currentPathname, router, searchParamsString]
  );

  return (
    <FormControl size="small">
      <Select
        onChange={handleOnChange}
        value={currentLanguage}
        variant="outlined"
        sx={{ color: 'white', minWidth: 120 }}
      >
        {i18nConfig.locales.map((locale) => {
          return (
            <MenuItem key={locale} value={locale}>
              {languages[locale]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
