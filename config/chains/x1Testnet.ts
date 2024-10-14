import type { Chain } from 'wagmi';

export const x1Testnet = {
  id: 204005,
  name: 'X1 Testnet',
  network: 'x1',
  nativeCurrency: {
    decimals: 18,
    name: 'XN',
    symbol: 'XN'
  },
  rpcUrls: {
    public: { http: ['https://x1-testnet.xen.network'] },
    default: { http: ['https://x1-testnet.xen.network'] }
  },
  blockExplorers: {
    etherscan: { name: 'X1 Testnet Explorer', url: 'https://explorer.x1-testnet.xen.network/' },
    default: { name: 'X1 Testnet Explorer', url: 'https://explorer.x1-testnet.xen.network/' }
  },
  contracts: {
    multicall3: {
      address: '0x88b53f909CD0105bd74029028896a8a169Dfa482',
      blockCreated: 2_826_205
    }
  }
} as const satisfies Chain;
