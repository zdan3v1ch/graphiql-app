'use client';

import {
  AppBar,
  Box,
  SxProps,
  Theme,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  children?: React.ReactNode;
}

const HeaderBar: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  const scroll = useScrollTrigger({ threshold: 50, disableHysteresis: true });

  const appBarStyle: SxProps<Theme> = !scroll
    ? {
        padding: 1,
      }
    : {
        padding: 0,
        backgroundColor: theme.palette.primary.dark,
      };

  return (
    <AppBar color="primary" className="" position="fixed">
      <Box sx={{ ...appBarStyle, transition: 'all 0.2s ease-out' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          {children}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default HeaderBar;
