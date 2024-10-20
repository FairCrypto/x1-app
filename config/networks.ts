import type { NextConfig } from 'next';

const arrayOrString = (something: any): string | string[] | null => {
  if (!something) return null;
  return something.split(',').length > 1 ? something.split(',').filter(e => !!e) : something;
};

export enum ContractOps {
  XEN_CLAIM_RANK,
  XEN_CLAIM_REWARD,
  XEM_CLAIM_RANK_BULK,
  XEM_CLAIM_REWARD_BULK,
  XEN_TORRENT_MINT,
  XEN_TORRENT_REDEEM,
  XEN_STAKE_START,
  XEN_STAKE_END,
  XEN_BURN
}

export type TNetworkConfig = {
  isTestnet: boolean;
  chainId: string | number;
  networkId: string;
  gasLimit?: number | null;
  gasFactor?: number | null;
  safeMaxVMUs?: number | null;
  name: string;
  icon?: any;
  currencyUnit?: string | null;
  decimals?: number | null;
  wsURL: string | string[] | null;
  rpcURL: string | string[] | null;
  wsURLBTest?: string | string[] | null;
  rpcURLBTest?: string | string[] | null;
  eventsUrl?: string | null;
  eventsTrendsUrl?: string | null;
  explorerUrl?: string | null;
  logoUrl?: string | Record<string, string> | null;
  contractAddress: string | number | null;
  minterAddress?: string | number | null;
  lowBurnMinterAddress?: string | number | null;
  torrentAddress?: string | number | null;
  stakerAddress?: string | number | null;
  burnerAddress?: string | number | null;
  tickerAddress?: string | number | null;
  knightsAddress?: string | number | null;
  tokenizerAddress?: string | number | null;
  varStakerAddress?: string | number | null;
  dbXenAddress?: string | number | null;
  dbXenViewsAddress?: string | number | null;
  dxnTokenAddress?: string | number | null;
  xenlonMarsAddress?: string | number | null;
  xlonTokenAddress?: string | number | null;
  fenixAddress?: string | number | null;
  xEthAddress?: string | number | null;
  xHexAddress?: string | number | null;
  xoneAddress?: string | number | null;
  vmpxAddress?: string | number | null;
  moonPartyAddress?: string | number | null;
  xenftMessage?: string | null;
  allowedOps?: ContractOps[] | null;
  xenTorrentGenesisBlock?: number | bigint | string | null;
};

const xenTorrentGenesisBlocks = {
  // mainnets
  mainnet: 16295439,
  bsc: 0,
  polygon: 0,
  avalanche: 0,
  ethpow: 0,
  moonbeam: 0,
  evmos: 0,
  fantom: 0,
  dogechain: 0,
  okxchain: 0,
  'pulse-chain': 0,
  'pulse-chain-og': 0,
  optimism: 0,
  base: 0,
  // testnets
  sepolia: 6878678,
  'bsc-testnet': 0,
  'pulse-testnet': 0,
  mumbai: 0,
  moonbase: 0,
  'evmos-testnet': 0,
  'fantom-testnet': 13958473,
  'avalanche-testnet': 19655989,
  holesky: 2543227
};

const addresses = (config: NextConfig = {}, networkId: string = 'mainnet') => ({
  contractAddress: config.contractAddress[networkId],
  minterAddress: config.minterAddress[networkId],
  lowBurnMinterAddress: config.lowBurnMinterAddress[networkId],
  stakerAddress: config.stakerAddress[networkId],
  burnerAddress: config.burnerAddress[networkId],
  tickerAddress: config.tickerAddress[networkId],
  knightsAddress: config.knightsAddress[networkId],
  tokenizerAddress: config.tokenizerAddress[networkId],
  varStakerAddress: config.varStakerAddress[networkId],
  dbXenAddress: config.dbXenAddress[networkId],
  dbXenViewsAddress: config.dbXenViewsAddress[networkId],
  dxnTokenAddress: config.dxnTokenAddress[networkId],
  xenlonMarsAddress: config.xenlonMarsAddress[networkId],
  xlonTokenAddress: config.xlonTokenAddress[networkId],
  fenixAddress: config.fenixAddress[networkId],
  xEthAddress: config.xEthAddress[networkId],
  xHexAddress: config.xHexAddress[networkId],
  xoneAddress: config.xoneAddress[networkId],
  vmpxAddress: config.vmpxAddress[networkId],
  moonPartyAddress: config.moonPartyAddress[networkId],
  xenTorrentGenesisBlock: xenTorrentGenesisBlocks[networkId]
});

const networkConfigs = ({ config = {} }: NextConfig): Record<string, TNetworkConfig> => ({
  // MAINNETS
  mainnet: {
    isTestnet: false,
    chainId: '0x1',
    networkId: 'mainnet',
    name: 'Ethereum',
    currencyUnit: 'ETH',
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    wsURL: arrayOrString(config.wsUrlOverrides?.mainnet),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.mainnet),
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.mainnet),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.mainnet),
    explorerUrl: 'https://etherscan.io/',
    logoUrl: '/logos/ethereum-logo.png',
    xenftMessage: config.xenftMessage?.mainnet,
    ...addresses(config, 'mainnet')
  },
  bsc: {
    isTestnet: false,
    chainId: `0x${(56).toString(16)}`,
    networkId: 'bsc',
    currencyUnit: 'BNB',
    gasLimit: 130_000_000,
    safeMaxVMUs: 475,
    name: 'BSC',
    wsURL: arrayOrString(config.wsUrlOverrides?.bsc),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.bsc),
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.bsc),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.bsc),
    explorerUrl: 'https://bscscan.com/',
    logoUrl: '/logos/bsc-logo.svg',
    xenftMessage: config.xenftMessage?.bsc,
    ...addresses(config, 'bsc')
  },
  polygon: {
    isTestnet: false,
    chainId: `0x${(137).toString(16)}`,
    networkId: 'polygon',
    currencyUnit: 'MATIC',
    gasLimit: 29_000_000,
    safeMaxVMUs: 128,
    name: 'Polygon',
    wsURL: arrayOrString(config.wsUrlOverrides?.polygon),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.polygon),
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.polygon),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.polygon),
    explorerUrl: 'https://polygonscan.com/',
    logoUrl: '/logos/polygon-logo.png',
    xenftMessage: config.xenftMessage?.polygon,
    ...addresses(config, 'polygon')
  },
  avalanche: {
    isTestnet: false,
    chainId: `0x${(43114).toString(16)}`,
    networkId: 'avalanche',
    currencyUnit: 'AVAX',
    name: 'Avalanche C',
    safeMaxVMUs: 72,
    gasLimit: 15_000_000,
    wsURL: arrayOrString(config.wsUrlOverrides?.avalanche),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.avalanche),
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.avalanche),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.avalanche),
    explorerUrl: 'https://snowtrace.io/',
    logoUrl: '/logos/avalanche-logo.png',
    xenftMessage: config.xenftMessage?.avalanche,
    ...addresses(config, 'avalanche')
  },
  ethpow: {
    isTestnet: false,
    chainId: `0x${(10001).toString(16)}`,
    networkId: 'ethpow',
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    currencyUnit: 'ETHW',
    name: 'Ethereum PoW',
    wsURL: arrayOrString(config.wsUrlOverrides?.ethpow) || null,
    rpcURL: arrayOrString(config.rpcUrlOverrides?.ethpow) || `https://mainnet.ethereumpow.org`,
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.ethpow),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.ethpow),
    explorerUrl: 'https://www.oklink.com/en/ethw/',
    logoUrl: '/logos/ethpow-logo.png',
    xenftMessage: config.xenftMessage?.ethpow,
    ...addresses(config, 'ethpow')
  },
  moonbeam: {
    isTestnet: false,
    chainId: `0x${(1284).toString(16)}`,
    networkId: 'moonbeam',
    currencyUnit: 'GLMR',
    name: 'Moonbeam',
    gasLimit: 12_900_000,
    safeMaxVMUs: 55,
    wsURL: arrayOrString(config.wsUrlOverrides?.moonbeam) || 'wss://moonbeam.public.blastapi.io',
    rpcURL: arrayOrString(config.rpcUrlOverrides?.moonbeam) || `https://rpc.ankr.com/moonbeam`,
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.moonbeam),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.moonbeam),
    explorerUrl: 'https://moonbeam.moonscan.io/',
    logoUrl: '/logos/moonbeam-logo.png',
    xenftMessage: config.xenftMessage?.moonbeam,
    ...addresses(config, 'moonbeam')
  },
  evmos: {
    isTestnet: false,
    chainId: `0x${(9001).toString(16)}`,
    networkId: 'evmos',
    currencyUnit: 'EVMOS',
    name: 'Evmos',
    gasLimit: 40_000_000,
    safeMaxVMUs: 200,
    wsURL: arrayOrString(config.wsUrlOverrides?.evmos) || null,
    rpcURL: arrayOrString(config.rpcUrlOverrides?.evmos) || `https://evmos-evm.publicnode.com`,
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.evmos),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.evmos),
    explorerUrl: 'https://evm.evmos.org/',
    logoUrl: '/logos/evmos-logo.png',
    xenftMessage: config.xenftMessage?.evmos,
    ...addresses(config, 'evmos')
  },
  fantom: {
    isTestnet: false,
    chainId: `0x${(250).toString(16)}`,
    networkId: 'fantom',
    currencyUnit: 'FTM',
    name: 'Fantom',
    safeMaxVMUs: 45,
    gasLimit: 10_000_000,
    wsURL: arrayOrString(config.wsUrlOverrides?.fantom) || null,
    rpcURL: arrayOrString(config.rpcUrlOverrides?.fantom) || `https://rpc.ankr.com/fantom/`,
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.fantom),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.fantom),
    explorerUrl: 'https://ftmscan.com/',
    logoUrl: '/logos/fantom-logo.svg',
    xenftMessage: config.xenftMessage?.fantom,
    ...addresses(config, 'fantom')
  },
  dogechain: {
    isTestnet: false,
    chainId: `0x${(2000).toString(16)}`,
    networkId: 'dogechain',
    currencyUnit: 'DOGE',
    name: 'Dogechain',
    wsURL: arrayOrString(config.wsUrlOverrides?.dogechain) || null,
    rpcURL: arrayOrString(config.rpcUrlOverrides?.dogechain) || `https://rpc.dogechain.dog`,
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.dogechain),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.dogechain),
    explorerUrl: 'https://explorer.dogechain.dog/',
    logoUrl: '/logos/dogechain-logo.png',
    xenftMessage: config.xenftMessage?.dogechain,
    ...addresses(config, 'dogechain')
  },
  okxchain: {
    isTestnet: false,
    chainId: `0x${(66).toString(16)}`,
    networkId: 'okxchain',
    currencyUnit: 'OKT',
    name: 'OKC (OKX Chain)',
    safeMaxVMUs: 200,
    gasLimit: 50_000_000,
    wsURL: arrayOrString(config.wsUrlOverrides?.okxchain) || null,
    rpcURL: arrayOrString(config.rpcUrlOverrides?.okxchain) || `https://exchainrpc.okex.org`,
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.okxchain),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.okxchain),
    eventsUrl: null,
    eventsTrendsUrl: null,
    explorerUrl: 'https://www.oklink.com/en/okc/',
    logoUrl: '/logos/okx-logo.svg',
    xenftMessage: config.xenftMessage?.okxchain,
    ...addresses(config, 'okxchain')
  },
  'pulse-chain': {
    isTestnet: false,
    chainId: '0x171',
    networkId: 'pulse-chain',
    currencyUnit: 'PLS',
    name: 'PulseChain',
    gasLimit: 30_000_000,
    gasFactor: 1.1,
    safeMaxVMUs: 128,
    wsURL: arrayOrString(config.wsUrlOverrides['pulse-chain']),
    rpcURL: arrayOrString(config.rpcUrlOverrides['pulse-chain']) || 'https://rpc.pulsechain.com',
    explorerUrl: 'https://scan.pulsechain.com/',
    logoUrl: '/logos/pulse-chain-logo.png',
    xenftMessage: config.xenftMessage['pulse-chain'],
    ...addresses(config, 'pulse-chain')
  },
  'pulse-chain-og': {
    isTestnet: false,
    chainId: '0x171',
    networkId: 'pulse-chain-og',
    currencyUnit: 'PLS',
    name: 'PulseChain OG',
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    wsURL: arrayOrString(config.wsUrlOverrides['pulse-chain-og']),
    rpcURL: arrayOrString(config.rpcUrlOverrides['pulse-chain-og']) || 'https://rpc.pulsechain.com',
    explorerUrl: 'https://scan.pulsechain.com/',
    logoUrl: '/logos/pulse-chain-logo.png',
    xenftMessage: config.xenftMessage['pulse-chain-og'],
    ...addresses(config, 'pulse-chain-og'),
    allowedOps: [ContractOps.XEN_TORRENT_REDEEM]
  },
  optimism: {
    isTestnet: false,
    chainId: '0xa',
    networkId: 'optimism',
    currencyUnit: 'ETH',
    name: 'Optimism',
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    wsURL: arrayOrString(config.wsUrlOverrides?.optimism),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.optimism),
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.optimism),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.optimism),
    explorerUrl: 'https://optimistic.etherscan.io/',
    logoUrl: '/logos/optimism-logo.png',
    xenftMessage: config.xenftMessage?.optimism,
    ...addresses(config, 'optimism')
  },
  base: {
    isTestnet: false,
    chainId: '0x2105',
    networkId: 'base',
    currencyUnit: 'ETH',
    name: 'Base',
    gasLimit: 30_000_000,
    safeMaxVMUs: 145,
    wsURL: arrayOrString(config.wsUrlOverrides?.base),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.base) || 'https://mainnet.base.org',
    // wsURLBTest: arrayOrString(config.wsUrlOverridesBTest?.base),
    // rpcURLBTest: arrayOrString(config.rpcUrlOverridesBTest?.base),
    explorerUrl: 'https://basescan.org/',
    logoUrl: '/logos/base-logo.svg',
    xenftMessage: config.xenftMessage?.base,
    ...addresses(config, 'base')
  },

  // TESTNETS
  sepolia: {
    isTestnet: true,
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    chainId: '0xaa36a7',
    networkId: 'sepolia',
    name: 'Sepolia Testnet',
    currencyUnit: 'SEP',
    wsURL: arrayOrString(config.wsUrlOverrides?.sepolia),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.sepolia),
    explorerUrl: 'https://sepolia.etherscan.io/',
    logoUrl: '/logos/ethereum-logo.png',
    ...addresses(config, 'sepolia')
  },
  holesky: {
    isTestnet: true,
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    chainId: '0x4268',
    networkId: 'holesky',
    name: 'Holesky Testnet',
    currencyUnit: 'ETH',
    wsURL: arrayOrString(config.wsUrlOverrides.holesky),
    rpcURL: arrayOrString(config.rpcUrlOverrides.holesky),
    explorerUrl: 'https://holesky.etherscan.io/',
    logoUrl: '/logos/ethereum-logo.png',
    ...addresses(config, 'holesky')
  },
  'bsc-testnet': {
    isTestnet: true,
    chainId: '0x61',
    networkId: 'bsc-testnet',
    name: 'BSC Testnet',
    wsURL: arrayOrString(config.wsUrlOverrides['bsc-testnet']),
    rpcURL:
      arrayOrString(config.rpcUrlOverrides['bsc-testnet']) ||
      'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com/',
    logoUrl: '',
    xenftMessage: config.xenftMessage['bsc-testnet'],
    ...addresses(config, 'bsc-testnet')
  },
  /*
  'pulse-testnet': {
    isTestnet: true,
    chainId: '0x3af',
    networkId: 'pulse-testnet',
    currencyUnit: 'PLS',
    name: 'PulseChain Testnet V4',
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    wsURL: arrayOrString(config.wsUrlOverrides['pulse-testnet']),
    rpcURL: arrayOrString(config.rpcUrlOverrides['pulse-testnet'])
      || 'https://rpc.v4.testnet.pulsechain.com',
    explorerUrl: 'https://scan.v4.testnet.pulsechain.com/',
    logoUrl: '/logos/pulse-chain-logo.png',
    xenftMessage: config.xenftMessage['pulse-testnet'],
    ...addresses(config, 'pulse-testnet'),
  },
   */
  'pulse-testnet': {
    isTestnet: true,
    chainId: '0x171',
    networkId: 'pulse-testnet',
    currencyUnit: 'PLS',
    name: 'PulseChain X',
    gasLimit: 30_000_000,
    safeMaxVMUs: 128,
    wsURL: arrayOrString(config.wsUrlOverrides['pulse-testnet']),
    rpcURL: arrayOrString(config.rpcUrlOverrides['pulse-testnet']) || 'https://rpc.pulsechain.com',
    explorerUrl: 'https://scan.pulsechain.com/',
    logoUrl: '/logos/pulse-chain-logo.png',
    xenftMessage: config.xenftMessage['pulse-testnet'],
    ...addresses(config, 'pulse-testnet')
  },
  mumbai: {
    isTestnet: true,
    gasLimit: 20_000_000,
    chainId: '0x13881',
    networkId: 'mumbai',
    name: 'Mumbai Testnet',
    currencyUnit: 'MATIC',
    wsURL: arrayOrString(config.wsUrlOverrides?.mumbai),
    rpcURL: arrayOrString(config.rpcUrlOverrides?.mumbai),
    explorerUrl: 'https://mumbai.polygonscan.com/',
    logoUrl: '/logos/polygon-logo.png',
    xenftMessage: config.xenftMessage?.mumbai,
    ...addresses(config, 'mumbai')
  },
  moonbase: {
    isTestnet: true,
    chainId: `0x${(1287).toString(16)}`,
    networkId: 'moonbase',
    name: 'Moonbase Alpha',
    currencyUnit: 'DEV',
    wsURL:
      arrayOrString(config.wsUrlOverrides?.moonbase) || 'wss://wss.api.moonbase.moonbeam.network',
    rpcURL:
      arrayOrString(config.rpcUrlOverrides?.moonbase) ||
      'https://rpc.api.moonbase.moonbeam.network',
    explorerUrl: 'https://moonbase.moonscan.io/',
    logoUrl: '/logos/moonbase-logo.svg',
    xenftMessage: config.xenftMessage?.moonbase,
    ...addresses(config, 'moonbase')
  },
  'evmos-testnet': {
    isTestnet: true,
    chainId: `0x${(9000).toString(16)}`,
    networkId: 'evmos-testnet',
    name: 'Evmos Testnet',
    currencyUnit: 'PHOTON',
    wsURL: arrayOrString(config.wsUrlOverrides['evmos-testnet']) || '',
    rpcURL:
      arrayOrString(config.rpcUrlOverrides['evmos-testnet']) ||
      'https://jsonrpc-t.evmos.nodestake.top',
    explorerUrl: 'https://testnet.mintscan.io/evmos-testnet/',
    logoUrl: '/logos/evmos-logo.png',
    xenftMessage: config.xenftMessage['evmos-testnet'],
    ...addresses(config, 'evmos-testnet')
  },
  'fantom-testnet': {
    isTestnet: true,
    chainId: `0x${(4002).toString(16)}`,
    networkId: 'fantom-testnet',
    name: 'Fantom Testnet',
    safeMaxVMUs: 45,
    gasLimit: 10_000_000,
    currencyUnit: 'FTM',
    wsURL: arrayOrString(config.wsUrlOverrides['fantom-testnet']) || '',
    rpcURL:
      arrayOrString(config.rpcUrlOverrides['fantom-testnet']) ||
      'https://rpc.ankr.com/fantom_testnet',
    explorerUrl: 'https://testnet.ftmscan.com/',
    logoUrl: '/logos/fantom-logo.svg',
    xenftMessage: config.xenftMessage['fantom-testnet'],
    ...addresses(config, 'fantom-testnet')
  },
  'avalanche-testnet': {
    isTestnet: true,
    chainId: `0x${(43113).toString(16)}`,
    networkId: 'avalanche-testnet',
    name: 'Avalanche Fuji Testnet',
    safeMaxVMUs: 42,
    gasLimit: 8_000_000,
    currencyUnit: 'AVAX',
    wsURL: arrayOrString(config.wsUrlOverrides['avalanche-testnet']),
    rpcURL:
      arrayOrString(config.rpcUrlOverrides['avalanche-testnet']) ||
      'https://rpc.ankr.com/avalanche_fuji',
    explorerUrl: 'https://testnet.snowtrace.io/',
    logoUrl: '/logos/avalanche-logo.png',
    xenftMessage: config.xenftMessage['avalanche-testnet'],
    ...addresses(config, 'avalanche-testnet')
  }
});

const networks = ({ config }: any): Record<string, TNetworkConfig> =>
  Object.entries(networkConfigs({ config })).reduce((res, [k, v]) => {
    if (v.isTestnet === !!config.isTestnet && config.supportedChains.includes(v.networkId)) {
      res[k] = v;
    }
    return res;
  }, {});

export default networks;
