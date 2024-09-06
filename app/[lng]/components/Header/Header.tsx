import { AppBar, Box, Chip, Stack, Toolbar } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';

import { auth } from '@/auth';
import { initI18n } from '@/app/i18n/i18n';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import { LanguageToggle } from '@/app/[lng]/components/LanguageToggle/LanguageToggle';
import NavButton from '@/components/NavButton';
import Logo from './components/Logo';
import BurgerMenu from './components/BurgerMenu';
import SignOutButton from './components/SignOutButton';
import { protectedNavButtonParams } from './constants';

interface Props {
  language: string;
}

const Header: React.FC<Props> = async ({ language }) => {
  const session = await auth();
  const ns = Namespaces.HEADER;
  const { t } = await initI18n({ language, namespaces: ns });

  const renderUserNavigation = () => {
    if (!session) {
      return (
        <>
          <NavButton
            label={t('signIn', { ns })}
            url="/signin"
            buttonProps={{
              variant: 'text',
              color: 'inherit',
              sx: { color: 'white' },
            }}
          />
          <NavButton
            label={t('signUp', { ns })}
            url="/register"
            buttonProps={{ variant: 'contained', color: 'secondary' }}
          />
        </>
      );
    }

    return (
      <>
        {protectedNavButtonParams.map((params) => (
          <NavButton
            key={`${params.labelHeaderNsKey}${params.url}`}
            label={t(params.labelHeaderNsKey, { ns })}
            url={params.url}
            buttonProps={{
              variant: 'text',
              color: 'inherit',
              sx: { color: 'white' },
            }}
          />
        ))}
        <Chip
          icon={<FaceIcon color="inherit" />}
          label={session.user?.name ?? 'No name'}
          sx={{ color: 'white', maxWidth: '10rem' }}
        />
        <SignOutButton />
      </>
    );
  };

  return (
    <AppBar color="primary" className="" position="static" sx={{ p: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Logo />
        <Box sx={{ display: { md: 'none' } }}>
          <BurgerMenu />
        </Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {renderUserNavigation()}
          <LanguageToggle />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
