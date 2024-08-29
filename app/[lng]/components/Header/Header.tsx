import { AppBar, Stack, Toolbar } from '@mui/material';
import { LanguageToggle } from '@/app/[lng]/components/LanguageToggle/LanguageToggle';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import { initI18n } from '@/app/i18n/i18n';

import Logo from './components/Logo';
import NavButton from './components/NavButton';

interface Props {
  language: string;
}

const Header: React.FC<Props> = async ({ language }) => {
  const ns = Namespaces.HEADER;
  const { t } = await initI18n({ language, namespaces: ns });

  return (
    <AppBar color="primary" className="" position="static" sx={{ p: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Logo />
        <Stack direction="row" spacing={2} alignItems="center">
          <NavButton
            label={t('signIn', { ns })}
            url="/signin"
            buttonProps={{ variant: 'text', sx: { color: 'white' } }}
          />
          <NavButton
            label={t('signUp', { ns })}
            url="/register"
            buttonProps={{ variant: 'contained', color: 'secondary' }}
          />
          <LanguageToggle />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
