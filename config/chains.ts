import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
  dogechain,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  goerli,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  okc,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  pulsechain,
  pulsechainV4,
  sepolia
} from 'viem/chains';

import { x1Fastnet } from '@/config/chains/x1Fastnet';
import { x1Testnet } from '@/config/chains/x1Testnet';

import { ethPow } from './chains/ethPow';
import { x1Devnet } from './chains/x1Devnet';

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
  goerli,
  sepolia,
  polygonMumbai,
  bscTestnet,
  avalancheFuji,
  moonbaseAlpha,
  evmosTestnet,
  fantomTestnet,
  pulsechainV4,
  arbitrumGoerli,
  optimismGoerli,
  baseGoerli,
  // X1 chains
  x1Devnet,
  x1Fastnet,
  x1Testnet
];
