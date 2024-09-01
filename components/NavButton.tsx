'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '@mui/material';

interface Props {
  label: string;
  url: string;
  onClick?: () => void;
  buttonProps: ButtonProps;
}

const NavButton: React.FC<Props> = ({ label, url, onClick, buttonProps }) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        if (onClick) {
          onClick();
        }
        router.push(url);
      }}
      {...buttonProps}
    >
      {label}
    </Button>
  );
};

export default NavButton;
