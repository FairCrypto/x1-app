'use client';

import { useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import MoonPartyTable from '@/app/x1/moon-party/table';
import networks from '@/config/networks';
import { ThemeContext } from '@/contexts/Theme';
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
  const { safeRows: perPage } = useContext(ThemeContext);
  const {
    global: torrent,
    user: torrentUser,
    isFetching: isFetchingXenft,
    fetchNextPageMintedTokenData
  } = useContext(XenTorrentContext);
  const { address, chain } = useAccount();
  const xenBalance = xenUser[chain?.id as number]?.[address as string]?.balance;
  const xenBurned = xenUser[chain?.id as number]?.[address as string]?.userBurns;
  // const ownedTokens = torrentUser[chain?.id as number]?.[address as string]?.ownedTokens || [];
  const mintedTokens = torrentUser[chain?.id as number]?.[address as string]?.mintedTokens || [];
  const tokenInfos = torrentUser[chain?.id as number]?.[address as string]?.tokens || {};
  const isFetching = isFetchingXen || isFetchingXenft;
  const [xenfts, setXenfts] = useState<Record<string, TokenInfo>>({});

  const config = useContext(Web3Context);
  const supportedNetworks = networks({ config });
  const currentNetwork = Object.values(supportedNetworks).find(
    n => Number(n?.chainId) === Number(chain?.id)
  );
  const networkId = currentNetwork?.networkId;

  useEffect(() => {
    const repeat = async () => {
      let result = await fetchNextPageMintedTokenData();
      console.log('fetching first page', result);
      while (
        result.hasNextPage &&
        result.data?.pageParams?.length <= mintedTokens.length / perPage
      ) {
        // eslint-disable-next-line no-await-in-loop
        result = await result.fetchNextPage();
        console.log('fetching next page', result);
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => {
          setTimeout(resolve, 1_000);
        });
      }
    };
    if (mintedTokens.length > 0) {
      repeat().then(() => console.log('done'));
    }
  }, [mintedTokens]);

  useEffect(() => {
    if (torrent?.[chain?.id as number] && mintedTokens.length > 0) {
      const contractBurnRates = torrent?.[chain?.id as number]?.specialClassesBurnRates;
      const classLimits = torrent?.[chain?.id as number]?.specialClassesCounters;
      if (classLimits) {
        classLimits[0] = 1_000_000_000_000;
      }

      const getBurnRate = id => {
        const cls = classLimits?.findLastIndex((l, i) => Number(id) <= l);
        return contractBurnRates?.[cls] || 0n;
      };
      const getClass = (id, isLimited) => {
        const cls = classLimits?.findLastIndex((l, i) => Number(id) <= l);
        return isLimited ? 1 : cls;
      };

      const mintInfos = Object.values(tokenInfos);
      const merged = mintInfos
        .map((l, i) => ({
          id: l.tokenId,
          burnRate: getBurnRate(l.tokenId),
          mintInfo: l
        }))
        .map(({ burnRate, mintInfo, id }) => ({
          id,
          cls: getClass(id, mintInfo.isLimited),
          burnRate: mintInfo.isLimited ? contractBurnRates?.[1] : burnRate,
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
            acc[className].burned += burnRate;
          }
          return acc;
        },
        {}
      );
      setXenfts(aggregated);
      console.log('aggregated', aggregated);
    } else {
      setXenfts({});
    }
  }, [
    chain,
    torrent,
    JSON.stringify(mintedTokens.map(_ => _.toString())),
    JSON.stringify(Object.entries(tokenInfos), (_key, value) =>
      typeof value === 'bigint' ? `${value.toString()}n` : value
    )
  ]);

  const aggregatedBurned = Object.values(xenfts).reduce(
    (acc, { burned }) => acc + BigInt(burned),
    0n
  );

  const rows = [
    {
      id: 'XEN Crypto',
      buy_cta: 'https://app.uniswap.org/#/swap',
      mint_cta: `https://xen.network/${networkId}/mint`,
      balance: xenBalance,
      burn_cta: 'Burn',
      burned: xenBurned - aggregatedBurned,
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
    ...Object.values(xenfts)
      .filter(({ className }) => className !== 'Collector')
      .map(({ className, burned, tokens }) => ({
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
