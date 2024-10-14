'use client';

import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import MoonPartyTable from '@/app/x1/moon-party/table';
import networks from '@/config/networks';
import { Web3Context } from '@/contexts/Web3';
import { XenCryptoContext } from '@/contexts/XenCrypto';
import { XenTorrentContext } from '@/contexts/XenTorrent';

const XenftClasses = [
  {
    name: 'Collector'
  },
  {
    name: 'Limited'
  },
  {
    name: 'Rare'
  },
  {
    name: 'Epic'
  },
  {
    name: 'Legendary'
  },
  {
    name: 'Exotic'
  },
  {
    name: 'Xunicorn'
  }
];

type TokenInfo = {
  className: string;
  burned: number;
  tokens: bigint[];
};

const State = () => {
  const { global: xen, user: xenUser, isFetching: isFetchingXen } = useContext(XenCryptoContext);
  const {
    global: torrent,
    user: torrentUser,
    isFetching: isFetchingXenft
  } = useContext(XenTorrentContext);
  const { address, chain } = useAccount();
  const xenBalance = xenUser[chain?.id as number]?.[address as string]?.balance;
  const xenBurned = xenUser[chain?.id as number]?.[address as string]?.userBurns;
  // const ownedTokens = torrentUser[chain?.id as number]?.[address as string]?.ownedTokens || [];
  const mintedTokens = torrentUser[chain?.id as number]?.[address as string]?.mintedTokens || [];
  const tokenInfos = torrentUser[chain?.id as number]?.[address as string]?.tokens || {};
  const isFetching = isFetchingXen || isFetchingXenft;
  const [xenfts, setXenfts] = useState<Record<string, TokenInfo>>({});
  // console.log('xenTorrent', torrent);
  // console.log('user', torrentUser);

  const config = useContext(Web3Context);
  const supportedNetworks = networks({ config });
  const currentNetwork = Object.values(supportedNetworks).find(
    n => Number(n?.chainId) === Number(chain?.id)
  );
  const networkId = currentNetwork?.networkId;

  useEffect(() => {
    if (torrent?.[chain?.id as number] && mintedTokens.length > 0) {
      const contractBurnRates = torrent?.[chain?.id as number]?.specialClassesBurnRates;
      const classLimits = torrent?.[chain?.id as number]?.specialClassesCounters;
      if (classLimits) {
        classLimits[0] = 1_000_000_000_000;
      }

      const getBurnRate = id => {
        const cls = classLimits?.findLastIndex((l, i) => id <= l);
        return contractBurnRates?.[cls] || 0;
      };
      const getClass = (id, isLimited) => {
        const cls = classLimits?.findLastIndex((l, i) => Number(id) <= l);
        return isLimited ? 1 : cls;
      };

      const burnRates = mintedTokens.map(getBurnRate);
      const mintInfos = Object.values(tokenInfos);
      const merged = mintInfos
        .map((l, i) => ({
          id: l.tokenId,
          burnRate: burnRates[i],
          mintInfo: mintInfos[i]
        }))
        .map(({ burnRate, mintInfo, id }) => ({
          id,
          cls: getClass(id, mintInfo.isLimited),
          burnRate: mintInfo.isLimited ? burnRates[1] : burnRate,
          mintInfo,
          minted: true
        }))
        .filter(({ cls }) => cls >= 0);

      const aggregated: Record<string, TokenInfo> = merged.reduce(
        (acc, { id, cls, burnRate, mintInfo }) => {
          const className = XenftClasses[cls].name;
          if (!acc[className]) {
            acc[className] = { className, burned: burnRate, tokens: [id] };
          } else {
            acc[className].tokens.push(id);
            acc[className].burned += acc[className].burned || 0;
          }
          return acc;
        },
        {}
      );
      setXenfts(aggregated);
      console.log('aggregated', aggregated, tokenInfos);
    } else {
      setXenfts({});
    }
  }, [
    chain,
    torrent,
    JSON.stringify(mintedTokens.map(_ => _.toString())),
    JSON.stringify(Object.entries(tokenInfos).map(([k, v]) => `${k}:${v.toString()}`))
  ]);

  const rows = [
    {
      id: 'XEN Crypto',
      buy_cta: 'https://app.uniswap.org/#/swap',
      mint_cta: `https://xen.network/${networkId}/mint`,
      balance: xenBalance,
      burn_cta: 'Burn',
      burned: xenBurned,
      used_burns: '0',
      avail_burns: '0',
      burn_points: '0',
      allocate_cta: 'Allocate',
      allocated: '0'
    },
    {
      id: 'eVMPX',
      buy_cta: 'https://app.uniswap.org/#/swap',
      mint_cta: undefined,
      balance: 0,
      burn_cta: undefined,
      burned: 0,
      used_burns: '0',
      avail_burns: '0',
      burn_points: '0',
      allocate_cta: 'Allocate',
      allocated: '0'
    },
    {
      id: 'XONE',
      buy_cta: 'https://app.uniswap.org/#/swap',
      mint_cta: undefined,
      balance: 0,
      burn_cta: undefined,
      burned: 0,
      used_burns: '0',
      avail_burns: '0',
      burn_points: '0',
      allocate_cta: 'Allocate',
      allocated: '0'
    },
    ...Object.values(xenfts).map(({ className, burned, tokens }) => ({
      id: `${className} XENFT`,
      buy_cta: 'https://blur.io/eth/collection/xenft-by-xen-crypto',
      mint_cta: 'Mint',
      balance: BigInt(tokens.length) * 10n ** 18n,
      burn_cta: undefined,
      burned,
      used_burns: '0',
      avail_burns: '0',
      burn_points: '0',
      allocate_cta: 'Allocate',
      allocated: '0'
    }))
  ];

  return <MoonPartyTable rows={rows} isFetching={isFetching} />;
};

export default State;
