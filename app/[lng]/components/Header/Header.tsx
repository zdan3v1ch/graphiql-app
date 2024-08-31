import { AppBar, Box, Chip, IconButton, Stack, Toolbar } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import MenuIcon from '@mui/icons-material/Menu';

import { auth } from '@/auth';
import { initI18n } from '@/app/i18n/i18n';
import { LanguageToggle } from '@/app/[lng]/components/LanguageToggle/LanguageToggle';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import NavButton from '../../../../components/NavButton';
import Logo from './components/Logo';
import SignOutButton from '@/app/[lng]/components/Header/components/SignOutButton';
import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';

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
        {protectedNavButtonParams.map((navButton) => (
          <NavButton
            key={`${navButton.labelHeaderNsKey}${navButton.url}`}
            label={t(navButton.labelHeaderNsKey, { ns })}
            url={navButton.url}
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
        <Box>
          <IconButton sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
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
