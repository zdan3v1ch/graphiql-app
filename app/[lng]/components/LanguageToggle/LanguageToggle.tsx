'use client';
import { i18nConfig, languages } from '@/app/i18n/data/i18n.constants';
import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { getExpires } from '@/app/i18n/utils/getExpires';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { t, i18n } = useTranslation(Namespaces.HEADER);
  const currentLanguage = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newLocale = event.target.value;
      document.cookie = `${i18nConfig.localeCookie}=${newLocale};expires=${getExpires()};path=/`;
      router.push(
        currentPathname.replace(`/${currentLanguage}`, `/${newLocale}`)
      );
      router.refresh();
    },
    [currentLanguage, currentPathname, router]
  );

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <FormControlLabel
        control={
          <Select
            onChange={handleOnChange}
            value={currentLanguage}
            autoWidth
            sx={{ marginLeft: 1 }}
          >
            {i18nConfig.locales.map((locale) => {
              return (
                <MenuItem key={locale} value={locale}>
                  {languages[locale]}
                </MenuItem>
              );
            })}
          </Select>
        }
        label={`${t('toggle')}: `}
        labelPlacement="start"
        sx={{ cursor: 'default' }}
      />
    </FormControl>
  );
}
