'use client';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip
} from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';

import { LinkTab } from '@/components/applicationBar/LinkTab';
import { StyledButton } from '@/components/applicationBar/StyledButton';
import { linkTabs } from '@/config/linkTabs';
import type { LinkTabProps } from '@/config/types';
import { ThemeContext } from '@/contexts/Theme';

import Alerts from '../alerts';

const ApplicationBar = () => {
  const { mode, setMode } = useContext(ThemeContext);
  const router = useRouter();
  const path = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [projectEl, setProjectEl] = useState<null | HTMLElement>(null);
  // const wagmiConfig = useConfig();
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
        {/* false && <XENIconButton networkId={networkId} mode={mode} /> */}
        <IconButton
          sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
          aria-controls={open ? 'navigation-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          open={open}
          role="navigation"
          anchorEl={anchorEl}
          id="navigation-menu"
          sx={{ '& .MuiMenu-paper': { width: '200px' } }}
          onClose={handleClose(null)}
          onClick={handleClose(null)}
        >
          {linkTabs()
            .filter((tab: LinkTabProps) => tab.href || tab.items)
            .map((tab: LinkTabProps) => {
              if (tab.href) {
                return (
                  <MenuItem
                    key={tab.value}
                    selected={path === tab.href}
                    onClick={handleClose(tab.href)}
                  >
                    {tab.label}
                  </MenuItem>
                );
              }
              return (
                <div key={tab.value}>
                  <Divider />
                  <Accordion
                    expanded={expanded === tab.value}
                    disableGutters
                    elevation={0}
                    key={`acc-${tab.value}`}
                    onChange={handleChange(tab.value as string)}
                    sx={{
                      padding: 0,
                      border: 0,
                      borderBottom: 0,
                      backgroundColor: 'transparent',
                      '&:before': {
                        display: 'none'
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{ padding: '0 auto 0 0' }}
                    >
                      <MenuItem
                        disableGutters
                        component="span"
                        sx={{
                          width: '100%',
                          '&:hover': {
                            backgroundColor: 'transparent'
                          }
                        }}
                        key={tab.value}
                      >
                        {tab.label}
                      </MenuItem>
                    </AccordionSummary>
                    <AccordionDetails>
                      {tab.items &&
                        tab.items.map((item: LinkTabProps) => (
                          <StyledButton
                            key={item.label}
                            props={{ ...item, mode }}
                            is_current={false}
                          />
                        ))}
                    </AccordionDetails>
                  </Accordion>
                </div>
              );
            })}
        </Menu>
        <Stack direction="row" sx={{ flexGrow: 1 }}>
          <Box role="navigation" sx={{ display: { xs: 'none', lg: 'block' } }}>
            {linkTabs().map((tab: any) => (
              <LinkTab
                // theme={theme}
                key={tab.value}
                label={tab.label}
                value={tab.value}
                href={tab.href}
                items={tab.items}
                menuEl={projectEl}
                setMenuEl={setProjectEl}
                current={path as string}
              />
            ))}
          </Box>
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
