'use client';

import { useRouter } from 'next/navigation';
import { CircularProgress, IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { signOut } from '@/auth/utils';
import { useState } from 'react';

interface Props {
  onSignOut?: () => void;
}

const SignOutButton: React.FC<Props> = ({ onSignOut }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <IconButton
      onClick={async () => {
        setLoading(true);
        await signOut();

        if (onSignOut) {
          onSignOut();
        }

        router.push('/');
      }}
      color="warning"
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size="1em" color="warning" />
      ) : (
        <ExitToAppIcon />
      )}
    </IconButton>
  );
};

export default SignOutButton;
