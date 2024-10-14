import { cookieToInitialState } from '@wagmi/core';
import { headers } from 'next/headers';
import React from 'react';

import { publicRuntimeConfig } from '@/app/libs/runtimeConfig';
import MountedProvider from '@/app/mounted';
import ApplicationBar from '@/app/x1/app-bar';
import { wagmiConfig } from '@/app/x1/config';
import Footer from '@/app/x1/footer';
import type { TPublicRuntimeConfig } from '@/config/runtimeConfig';
import { Web3Provider } from '@/contexts/Web3';
import styles from '@/styles/Home.module.css';

export const dynamic = 'auto';

const X1Layout = ({ children }) => {
  const config: TPublicRuntimeConfig = publicRuntimeConfig as unknown as TPublicRuntimeConfig;
  const { chains } = wagmiConfig as any;
  const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie'));

  return (
    <MountedProvider>
      <Web3Provider
        publicRuntimeConfig={config}
        wagmiConfig={{ chains }}
        initialState={initialState}
      >
        <ApplicationBar />
        <main className={styles.main} style={{ minHeight: '90vh' }}>
          <section style={{ width: '100%' }}>{children}</section>
        </main>
        <Footer tokenAddress={undefined} contractAddress={undefined} />
      </Web3Provider>
    </MountedProvider>
  );
};

export default X1Layout;
