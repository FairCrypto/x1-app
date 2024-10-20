'use client';

import '../../styles/fonts/stylesheet.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { createContext } from 'react';
import type { State } from 'wagmi';
import { http, WagmiProvider, webSocket } from 'wagmi';
import { type Chain } from 'wagmi/chains';

import { chains as allChains } from '@/config/chains';
import networks from '@/config/networks';
import type { TPublicRuntimeConfig } from '@/config/runtimeConfig';
import { useTheme } from '@/contexts/Theme';

export const Web3Context = createContext<TPublicRuntimeConfig>({} as TPublicRuntimeConfig);

export const Web3Provider = ({
  children,
  publicRuntimeConfig,
  wagmiConfig,
  initialState,
  mode
}: {
  children: React.ReactNode;
  publicRuntimeConfig: TPublicRuntimeConfig;
  wagmiConfig: Record<string, any>;
  initialState: State | undefined;
  mode: string;
}) => {
  const { rkTheme } = useTheme();

  console.log('publicRuntimeConfig', publicRuntimeConfig);
  const { isTestnet } = publicRuntimeConfig;
  const supportedNetworks = networks({ config: publicRuntimeConfig });
  const supportedChainIds = Object.values(supportedNetworks)
    .filter(n => n.isTestnet === !!isTestnet)
    .map(n => Number(n.chainId));

  const supportedChains = allChains.filter(chain => supportedChainIds.includes(chain.id));

  const projectId = publicRuntimeConfig?.walletConnectApiKey || '';

  const wallets = [
    metaMaskWallet,
    phantomWallet,
    rainbowWallet,
    walletConnectWallet,
    rabbyWallet,
    // bitKeepWallet({ projectId, chains }),
    // trustWallet,
    // okxWallet,
    coinbaseWallet,
    injectedWallet
  ];

  const chainById = (id: number) =>
    Object.values(supportedNetworks).find(n => Number(n.chainId) === id) ||
    supportedNetworks?.mainnet;

  const getRPCs = (chain: Chain) => ({
    http: Array.isArray(chainById(chain.id)?.rpcURL)
      ? chainById(chain.id)?.rpcURL?.[0]
      : (chainById(chain.id)?.rpcURL as string),
    webSocket: Array.isArray(chainById(chain.id)?.wsURL)
      ? chainById(chain.id)?.wsURL?.[0]
      : (chainById(chain.id)?.wsURL as string)
  });

  const transports = supportedChains.reduce((res, chain) => {
    res[chain.id] = getRPCs(chain).webSocket
      ? webSocket(getRPCs(chain).webSocket)
      : http(getRPCs(chain).http);
    return res;
  }, {});

  const config = getDefaultConfig({
    appName: 'Xen Network',
    projectId,
    wallets: [
      {
        groupName: 'Recommended',
        wallets
      }
    ],
    chains: wagmiConfig.chains,
    // ssr: true,
    transports
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rkTheme}>
          <Web3Context.Provider value={publicRuntimeConfig}>{children}</Web3Context.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
