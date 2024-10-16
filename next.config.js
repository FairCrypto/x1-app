/** @type {import('next').NextConfig} */
export const nextConfig = {
  reactStrictMode: true,
  // swcMinify: false,
  output: 'standalone',
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  redirects() {
    return [
      {
        source: '/terms.html',
        destination: `/terms`,
        permanent: true
      }
    ];
  },
  experimental: {}
};

// Injected content via Sentry wizard below

import { withSentryConfig } from '@sentry/nextjs';

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'fair-crypto-foundation',
    project: 'xen-crypto-app'
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    // tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    automaticVercelMonitors: false
  }
);
