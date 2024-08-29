'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@mui/material';

interface Props {
  label: string;
  url: string;
  buttonProps: ButtonProps;
}

const NavButton: React.FC<Props> = ({ label, url, buttonProps }) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(url);
      }}
      {...buttonProps}
    >
      {label}
    </Button>
  );
};

export default NavButton;
