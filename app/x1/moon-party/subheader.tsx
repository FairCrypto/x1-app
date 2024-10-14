'use client';

import { Container, Toolbar, Typography } from '@mui/material';
import React, { useContext } from 'react';

import { NotificationsContext } from '@/contexts/Notifications';
import { ThemeContext } from '@/contexts/Theme';

const Subheader = () => {
  const { isLarge } = useContext(ThemeContext);
  const { notifications } = useContext(NotificationsContext);

  const hasAlerts = notifications.alerts.length > 0;
  const calcTop = () => {
    if (isLarge) return hasAlerts ? '114px' : '64px';
    return hasAlerts ? '114px' : '56px';
  };
  return (
    <Container
      maxWidth={false}
      sx={{
        zIndex: 1,
        backgroundColor: theme => theme.palette.background.default,
        position: 'sticky',
        width: '100vw',
        left: 0,
        top: calcTop()
      }}
    >
      <Toolbar
        sx={{
          width: '100vw',
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <Typography
          sx={{
            // width: '20%',
            margin: '0 ',
            marginLeft: 1,
            fontWeight: 'bold'
          }}
          variant="h5"
        >
          X1 Moon Party
        </Typography>
      </Toolbar>
    </Container>
  );
};

export default Subheader;
