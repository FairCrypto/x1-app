// import xenBurn from '@faircrypto/xen-burn/build/contracts/XENBurn.json' ;
import xenBurn from '@faircrypto/xen-buy-and-burn/artifacts/contracts/XENBuyAndBurn.sol/XENBuyAndBurn.json';
import xenCrypto from '@faircrypto/xen-crypto/build/contracts/XENCrypto.json';
import knights from '@faircrypto/xen-knights/build/contracts/XENKnights.json';
import xenStake from '@faircrypto/xen-stake/build/contracts/XENStake.json';
import xenTorrent from '@faircrypto/xenft/build/contracts/XENTorrent.json';
import xEth from '@faircrypto/xeth/artifacts/contracts/xETH.sol/xETH.json';
import type { Abi } from 'viem';

import { projects } from '@/config/projects';

import auctionedToken from '../public/abi/AuctionedToken.json';
import dbXen from '../public/abi/DBXen.json';
import dxnToken from '../public/abi/DBXenERC20.json';
import dbXenViews from '../public/abi/DBXenViews.json';
import fenix from '../public/abi/Fenix.json';
import hexABI from '../public/abi/HEX.json';
import moonParty from '../public/abi/MoonParty.json';
import vmpx from '../public/abi/VMPX.json';
import xenlonMars from '../public/abi/XenlonMars.json';
import xlonToken from '../public/abi/XenlonMarsERC20.json';
import xenTicker from '../public/abi/XENTicker.json';
import tokenizer from '../public/abi/XENTokenizer.json';
import varStaker from '../public/abi/XENVarStaker.json';
import xHex from '../public/abi/XHeX.json';
import xone from '../public/abi/XONE.json';
import knightsRankings from '../public/knights/rankings.json';

const contractInfo = (projects = {}) =>
  Object.values(projects).reduce(
    (res: Record<string, any>, p: any) => ({
      ...res,
      ...p.contracts.reduce((obj, contract, idx) => {
        const envPrefix = p.envPrefix[idx];
        obj[`${contract}Address`] = (process.env.SUPPORTED_CHAINS || 'mainnet')
          .split(',')
          .filter(_ => !!_)
          .reduce((params, chain) => {
            const envKey = `${envPrefix}_${chain.toUpperCase().replace(/-/g, '_')}`;
            const envParam = process.env[envKey];
            if (envPrefix && envParam) {
              params[chain] = envParam;
            }
            return params;
          }, {});
        return obj;
      }, {})
    }),
    {} as Record<string, any>
  );

export type TPublicRuntimeConfig = {
  knightsRankings: any;
  rpcBTestingRatio: string;
  xenApiUrl: string;
  alerts: any;
  requireTermsSigning: boolean;
  xenftMessage: Record<string, string>;
  providerTimeout: number;
  debug: string;
  xenCryptoABI: Abi;
  xenTorrentABI: Abi;
  xenStakeABI: Abi;
  xenBurnABI: Abi;
  xenTickerABI: Abi;
  knightsABI: Abi;
  tokenizerABI: Abi;
  varStakerABI: Abi;
  auctionedTokenABI: Abi;
  dbXenABI: Abi;
  dbXenViewsABI: Abi;
  dxnTokenABI: Abi;
  xenlonMarsABI: Abi;
  xlonTokenABI: Abi;
  fenixABI: Abi;
  xEthABI: Abi;
  xHexABI: Abi;
  hexABI: Abi;
  vmpxABI: Abi;
  xoneABI: Abi;
  moonPartyABI: Abi;
  defaultMarketplaceApiUrl: string;
  marketplaceApiUrl: Record<string, string>;
  defaultMarketplaceAssetUrl: string;
  marketplaceAssetUrl: Record<string, string>;
  waitForConfirmationsNumber: number;
  defaultProvider: string;
  buyXenLink: string;
  rpcPollingInterval: number;
  walletConnectApiKey: string;
  walletConnectVersion: string;
  nodeEnv: string;
  infuraId: string;
  alchemyId: string;
  quickNodeId: string;
  defaultNetworkId: string;
  wsUrl: string;
  rpcUrl: string;
  xenVersion: string;
  deployedUrl: string;
  isTestnet: number;
  supportedChains: string[];
  wsUrlOverrides: Record<string, string>;
  rpcUrlOverrides: Record<string, string>;
  rpcUrlOverridesBTest: Record<string, string>;
  wsUrlOverridesBTest: Record<string, string>;
  apiBaseUrl: string;
} & Record<string, any>;

export const publicRuntimeConfig = {
  knightsRankings,
  rpcBTestingRatio: process.env.RPC_B_TESTING_RATIO || 0.5,
  xenApiUrl: 'https://api.xen.network/v1',
  alerts: {
    5: {
      'pulse-chain-og': {
        mint: { text: 'New Mints are disabled' },
        stake: { text: 'New Stakes are disabled' },
        xenfttorrent: { text: 'XENFT Mints are disabled. XENFTs not eligible for XN airdrops' }
      }
    } // new alerts start with this number
  },
  requireTermsSigning: !!process.env.REQUIRE_SIGNING,
  xenftMessage: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`XENFT_MESSAGE_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`XENFT_MESSAGE_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  providerTimeout: 5_000,
  debug: process.env.DEBUG,
  xenCryptoABI: xenCrypto.abi as Abi,
  xenTorrentABI: xenTorrent.abi as Abi,
  xenStakeABI: xenStake.abi as Abi,
  // xenBurnABI: xenBurn.abi as Abi,
  xenBurnABI: xenBurn.abi as Abi,
  xenTickerABI: xenTicker.abi as Abi,
  knightsABI: knights.abi as Abi,
  tokenizerABI: tokenizer.abi as Abi,
  varStakerABI: varStaker.abi as Abi,
  auctionedTokenABI: auctionedToken.abi as Abi,
  dbXenABI: dbXen.abi as Abi,
  dbXenViewsABI: dbXenViews.abi as Abi,
  dxnTokenABI: dxnToken.abi as Abi,
  xenlonMarsABI: xenlonMars.abi as Abi,
  xlonTokenABI: xlonToken.abi as Abi,
  fenixABI: fenix.abi as Abi,
  xEthABI: xEth.abi as Abi,
  xHexABI: xHex.abi as Abi,
  hexABI: hexABI as Abi,
  vmpxABI: vmpx.abi as Abi,
  xoneABI: xone.abi as Abi,
  moonPartyABI: moonParty.abi as Abi,
  defaultMarketplaceApiUrl: process.env.OPENSEA_API_URL,
  marketplaceApiUrl: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`MARKETPLACE_API_URL_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`MARKETPLACE_API_URL_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  defaultMarketplaceAssetUrl: process.env.OPENSEA_URL,
  marketplaceAssetUrl: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`MARKETPLACE_URL_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`MARKETPLACE_URL_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  waitForConfirmationsNumber: 1,
  defaultProvider: process.env.DEFAULT_PROVIDER || false,
  buyXenLink:
    process.env.BUY_XEN_LINK || 'https://coinmarketcap.com/currencies/xen-crypto/markets/',
  rpcPollingInterval: parseInt(process.env.RPC_POLLING_INTERVAL || '0') || 30_000,
  walletConnectApiKey: process.env.NEXT_PUBLIC_WALLETCONNECT_KEY,
  walletConnectVersion: process.env.WALLETCONNECT_VERSION,
  nodeEnv: process.env.NODE_ENV,
  infuraId: process.env.INFURA_KEY || process.env.NEXT_PUBLIC_INFURA_KEY,
  alchemyId: process.env.ALCHEMY_KEY,
  quickNodeId: process.env.QUICKNODE_KEY,
  defaultNetworkId: process.env.ETH_NETWORK_ID,
  wsUrl: process.env.WS_URL,
  rpcUrl: process.env.RPC_URL,
  xenVersion: process.env.XEN_VERSION || '1',
  deployedUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || 'https://xen.network',
  isTestnet: Number(process.env.IS_TESTNET || '0'),
  supportedChains: (process.env.SUPPORTED_CHAINS || 'mainnet').split(',').filter(c => !!c),
  wsUrlOverrides: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`WS_URL_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`WS_URL_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  rpcUrlOverrides: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`RPC_URL_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`RPC_URL_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  rpcUrlOverridesBTest: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`RPC_URL_B_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`RPC_URL_B_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  wsUrlOverridesBTest: (process.env.SUPPORTED_CHAINS || 'mainnet')
    .split(',')
    .filter(_ => !!_)
    .reduce((res, e) => {
      if (process.env[`WS_URL_B_${e.toUpperCase().replace(/-/g, '_')}`]) {
        res[e] = process.env[`WS_URL_B_${e.toUpperCase().replace(/-/g, '_')}`];
      }
      return res;
    }, {}),
  // minterContractAbi: process.env.MINTER_CONTRACT_ABI,
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.xen.network/v1',
  ...(contractInfo(projects) as Record<string, any>)
};
