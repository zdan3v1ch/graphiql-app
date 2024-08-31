'use client';

import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { signOut } from '@/auth/utils';

const SignOutButton = () => {
  return (
    <IconButton
      onClick={async () => {
        await signOut();
      }}
      color="warning"
    >
      <ExitToAppIcon />
    </IconButton>
  );
};

export default SignOutButton;
