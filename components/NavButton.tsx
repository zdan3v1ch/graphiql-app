'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  label: string;
  url: string;
  onClick?: () => void;
  buttonProps: ButtonProps;
}

const NavButton: React.FC<Props> = ({ label, url, onClick, buttonProps }) => {
  const router = useRouter();
  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up(1050));

  return (
    <Button
      onClick={() => {
        if (onClick) {
          onClick();
        }
        router.push(url);
      }}
      style={{ fontSize: upLg ? '0.875rem' : '0.6rem' }}
      {...buttonProps}
    >
      {label}
    </Button>
  );
};

export default NavButton;
