// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://1923b01118764684825bc3d70dcdda25@o4505405289201664.ingest.sentry.io/4505405292806144',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1 / 100,

  profilesSampleRate: 1 / 100,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false
});
