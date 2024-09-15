'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  useMediaQuery,
  Drawer,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';

import { Namespaces } from '@/app/i18n/data/i18n.enum';

import { protectedNavButtonParams } from '../constants';
import FaceIcon from '@mui/icons-material/Face';
import SignOutButton from '@/app/[lng]/components/Header/components/SignOutButton';
import { LanguageToggle } from '@/app/[lng]/components/LanguageToggle/LanguageToggle';
import NavButton from '@/components/NavButton';
import { Session } from 'next-auth';

interface Props {
  session: Session | null;
}

const BurgerMenu: React.FC<Props> = ({ session }) => {
  const router = useRouter();
  const { t } = useTranslation(Namespaces.HEADER);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (matches && open) {
      setOpen(false);
    }
  }, [matches, open, setOpen]);

  const renderDrawerList = () => {
    if (!session) {
      return (
        <>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push('/signin');
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary={t('signIn')} />
              </ListItemButton>
            </ListItem>
          </List>
          <Box paddingInline={1}>
            <NavButton
              label={t('signUp')}
              url="/register"
              onClick={() => {
                setOpen(false);
              }}
              buttonProps={{
                variant: 'contained',
                color: 'secondary',
                fullWidth: true,
              }}
            />
          </Box>
        </>
      );
    }

    return (
      <List>
        {protectedNavButtonParams.map((params) => {
          const NavButtonIcon = params.muiIcon;

          return (
            <ListItem
              key={`${params.labelHeaderNsKey}${params.url}`}
              disablePadding
            >
              <ListItemButton
                onClick={() => {
                  router.push(params.url);
                  setOpen(false);
                }}
              >
                <ListItemIcon>
                  <NavButtonIcon />
                </ListItemIcon>
                <ListItemText primary={t(params.labelHeaderNsKey)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Stack direction="row" spacing={2}>
      <LanguageToggle />

      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          {renderDrawerList()}
        </Box>

        {session && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
          >
            <Chip
              color="default"
              icon={<FaceIcon color="primary" />}
              label={session?.user?.name ?? 'No name'}
            />
            <SignOutButton
              onSignOut={() => {
                setOpen(false);
              }}
            />
          </Stack>
        )}
      </Drawer>
    </Stack>
  );
};

export default BurgerMenu;
