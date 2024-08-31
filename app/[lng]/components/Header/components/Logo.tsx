'use client';

import { useRouter } from 'next/navigation';
import TollIcon from '@mui/icons-material/Toll';
import { IconButton } from '@mui/material';

const Logo = () => {
  const router = useRouter();

  return (
    <IconButton
      onClick={() => {
        router.push('/');
      }}
    >
      <TollIcon color="action" fontSize="large" />
    </IconButton>
  );
};

export default Logo;
