import type { Chain } from 'wagmi';

export const x1Fastnet = {
  id: 4003,
  name: 'X1 Fastnet',
  network: 'x1',
  nativeCurrency: {
    decimals: 18,
    name: 'XN',
    symbol: 'XN'
  },
  rpcUrls: {
    public: { http: ['https://x1-fastnet.infrafc.org'] },
    default: { http: ['https://x1-fastnet.infrafc.org'] }
  },
  blockExplorers: {
    etherscan: { name: 'X1 Fastnet Explorer', url: 'https://explorer.x1-fastnet.infrafc.org/' },
    default: { name: 'X1 Fastnet Explorer', url: 'https://explorer.x1-fastnet.infrafc.org/' }
  },
  contracts: {
    multicall3: {
      address: '0x8058eD4b047D2590d09fE22DD0d019Eef407276C',
      blockCreated: 245_370
    }
  }
} as const satisfies Chain;
