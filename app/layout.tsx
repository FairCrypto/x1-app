import '../styles/fonts/stylesheet.css';

import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import React from 'react';

import { NotificationsProvider } from '@/contexts/Notifications';
import { FlexibleThemeProvider } from '@/contexts/Theme';

import Notifications from './notifications';

export const dynamic = 'force-dynamic';

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <AppRouterCacheProvider>
        <FlexibleThemeProvider>
          <NotificationsProvider>
            <CssBaseline />
            <Notifications />
            {children}
          </NotificationsProvider>
        </FlexibleThemeProvider>
      </AppRouterCacheProvider>
    </body>
  </html>
);

export default RootLayout;
