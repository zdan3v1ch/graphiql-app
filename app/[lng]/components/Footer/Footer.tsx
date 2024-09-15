import { Avatar, Box, Link, Paper, Toolbar } from '@mui/material';
import React from 'react';

const Footer = () => {
  return (
    <Paper
      sx={{
        marginTop: 'auto',
      }}
      component="footer"
      variant="outlined"
      square
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            href="https://github.com/lobovskiy"
          >
            <Avatar src="/Art.jpg" alt="Artem" sx={{ width: 40, height: 40 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              Artem Lobovskii
            </Box>
          </Link>
          <Link
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            href="https://github.com/zdan3v1ch"
          >
            <Avatar
              src="/Ana.jpg"
              alt="Anatoli"
              sx={{ width: 40, height: 40 }}
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              Anatoli Zdanevich
            </Box>
          </Link>
          <Link
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            href="https://github.com/90viktoriya"
          >
            <Avatar src="/Vik.jpg" alt="Vika" sx={{ width: 40, height: 40 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              Viktoriya Schepalina
            </Box>
          </Link>
        </Box>
        <Box>2024</Box>
        <Box>
          <Link href="https://rs.school/react/">
            <Avatar src="/rss.svg" alt="RSS" sx={{ width: 40, height: 40 }} />
          </Link>
        </Box>
      </Toolbar>
    </Paper>
  );
};

export default Footer;
