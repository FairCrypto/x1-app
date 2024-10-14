import type { Chain } from 'wagmi';

export const ethPow = {
  id: 10001,
  name: 'Ethereum PoW',
  network: 'ethpow',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHW',
    symbol: 'ETHW'
  },
  rpcUrls: {
    public: { http: ['https://mainnet.ethereumpow.org'] },
    default: { http: ['https://mainnet.ethereumpow.org'] }
  },
  blockExplorers: {
    etherscan: { name: 'EthPoW Explorer', url: 'https://www.oklink.com/en/ethw' },
    default: { name: 'EthPoW Explore', url: 'https://www.oklink.com/en/ethw' }
  },
  contracts: {
    // multicall3: {
    //  address: '0xDfD254a6a32a30924A88E6d9E39bB209C0b75cAC',
    //  blockCreated: 5_306_514,
    // },
  }
} as const satisfies Chain;
