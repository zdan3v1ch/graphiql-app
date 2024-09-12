'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { removeLocaleFromUrl } from '@/app/utils';
import { locales } from '@/app/i18n/data/i18n.constants';
import useGetAllSearchParams from '@/app/[lng]/hooks/useGetAllSearchParams';

function useClientInitialParams(nameSpaces: Namespaces[]) {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));
  const { t, i18n } = useTranslation(nameSpaces);
  const pathname = usePathname();
  const delocalizedPathname = removeLocaleFromUrl(pathname, locales);
  const searchParamsString = useGetAllSearchParams();
  const clientUrl = `${delocalizedPathname}?${searchParamsString}`;

  return { upSm, t, i18n, pathname, clientUrl };
}

export default useClientInitialParams;
