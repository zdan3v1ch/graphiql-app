'use client';

import { AppBar, Box, Button, useMediaQuery, useTheme } from '@mui/material';
import TollIcon from '@mui/icons-material/Toll';
import React, { useState } from 'react';
import { LanguageToggle } from '@/app/[lng]/components/LanguageToggle/LanguageToggle';
import { Namespaces } from '@/app/i18n/data/i18n.enum';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const theme = useTheme();
  const isMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const [auth, setAuth] = useState(true);
  const { t } = useTranslation(Namespaces.HEADER);

  function handleAuth(): void {
    setAuth(!auth);
  }
  return (
    <AppBar color="default" className="" position="static">
      <Box
        sx={{ flexDirection: 'row', display: 'flex', height: 50, padding: 0.5 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TollIcon color="primary" fontSize="large" />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <LanguageToggle></LanguageToggle>
        </Box>
        {isMatches && (
          <Box>
            {auth && (
              <Box sx={{ flexGrow: 1 }}>
                <Button variant="contained" onClick={handleAuth}>
                  {t('signIn')}
                </Button>
                <Button variant="contained">{t('signUp')}</Button>
              </Box>
            )}
            {!auth && (
              <Box sx={{ flexGrow: 1 }}>
                <Button variant="contained" onClick={handleAuth}>
                  {t('signOut')}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </AppBar>
  );
};

export default Header;
