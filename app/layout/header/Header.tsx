"use client"

import { AppBar, Box, Button, useMediaQuery, useTheme } from '@mui/material';
import TollIcon from '@mui/icons-material/Toll';
import React, { useState } from 'react';

const Header = () => {
  const theme = useTheme();
  const isMatches = useMediaQuery(theme.breakpoints.up('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(true);
  function handleClick(): void {
    setIsOpen(!isOpen)
  }
  function handleAuth(): void {
    setAuth(!auth)
  }
  return (
    <AppBar color="default" className='' position="static">
      <Box sx={{ flexDirection: 'row', display: 'flex', height: 50, padding: 0.5}} >
        <Box sx={{ flexGrow: 1 }}>
          <TollIcon color="primary" fontSize="large" />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Button variant={isOpen ? 'contained' : 'outlined'} onClick={handleClick}>Lang Toggle</Button>
        </Box>
        {isMatches &&
          <Box>
            {auth &&
              <Box sx={{ flexGrow: 1 }}>
                <Button variant="contained" onClick={handleAuth}>Sign In</Button>
                <Button variant="contained">Sign up</Button>
              </Box>}
            {!auth &&
              <Box sx={{ flexGrow: 1 }}>
                <Button variant="contained" onClick={handleAuth}>Sign Out</Button>
              </Box>}
          </Box>

        }

      </Box>
    </AppBar>
  );
};

export default Header;
