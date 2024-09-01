'use client';

import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { signOut } from '@/auth/utils';

interface Props {
  onSignOut?: () => void;
}

const SignOutButton: React.FC<Props> = ({ onSignOut }) => {
  const router = useRouter();

  return (
    <IconButton
      onClick={async () => {
        await signOut();

        if (onSignOut) {
          onSignOut();
        }

        router.push('/');
      }}
      color="warning"
    >
      <ExitToAppIcon />
    </IconButton>
  );
};

export default SignOutButton;
