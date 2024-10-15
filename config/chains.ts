import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  dogechain,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  okc,
  optimism,
  polygon,
  pulsechain,
  pulsechainV4,
  sepolia
} from 'viem/chains';

import { ethPow } from './chains/ethPow';

export const chains = [
  // mainnets
  mainnet,
  polygon,
  bsc,
  avalanche,
  moonbeam,
  evmos,
  fantom,
  dogechain,
  okc,
  pulsechain,
  ethPow,
  arbitrum,
  optimism,
  base,
  // testnets
  sepolia,
  bscTestnet,
  avalancheFuji,
  moonbaseAlpha,
  evmosTestnet,
  fantomTestnet,
  pulsechainV4
];
