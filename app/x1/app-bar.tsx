'use client';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';

import { ThemeContext } from '@/contexts/Theme';

import Alerts from '../alerts';

const ApplicationBar = () => {
  const { mode, setMode } = useContext(ThemeContext);
  const router = useRouter();
  const path = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [projectEl, setProjectEl] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = href => () => {
    setAnchorEl(null);
    if (href)
      if (href.startsWith('/')) {
        router.replace(href);
      } else if (href.startsWith('http') && typeof window !== 'undefined') {
        window.open(href, '_blank');
      }
  };

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', mode === 'dark' ? 'light' : 'dark');
    }
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    event.stopPropagation();
    if (newExpanded) {
      setExpanded(panel);
    }
  };

  const isHomePage = path === '/';

  return (
    <AppBar position="fixed" elevation={0}>
      <Alerts />
      <Toolbar sx={{}}>
        <Stack direction="row" sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Image src="/x1-logo.png" alt="X1 Logo" width={40} height={40} />
          <Typography
            sx={{
              // width: '20%',
              margin: '0 ',
              marginLeft: 1,
              fontWeight: 'bold'
            }}
            variant="h5"
          >
            Moon Party
          </Typography>
        </Stack>
        <Tooltip title="Toggle light/dark mode">
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon sx={{ color: 'black' }} />}
          </IconButton>
        </Tooltip>
        <ConnectButton />
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
