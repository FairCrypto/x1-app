'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { parseAbiItem, zeroAddress } from 'viem';
import { getLogs } from 'viem/actions';
import {
  useAccount,
  useBlock,
  useClient,
  useConfig,
  useInfiniteReadContracts,
  useReadContract,
  useReadContracts
} from 'wagmi';
import { useQuery } from 'wagmi/query';

import { ThemeContext } from '@/contexts/Theme';
import { Web3Context } from '@/contexts/Web3';

import networks from '../../config/networks';
import { decodeURI, decodeXenTorrentMintInfo } from './decoders';
import type { TXenTorrentContext } from './types';

const initialValue: TXenTorrentContext = {
  global: {},
  user: {},
  isFetching: false,
  setUser: () => {},
  refetchOwnedTokens: () => {},
  refetchAllowance: () => {},
  fetchNextPage: () => {},
  fetchNextPageMintedTokenData: () => {}
};

const ascending = (a: bigint, b: bigint) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

export const XenTorrentContext = createContext<TXenTorrentContext>(initialValue);

export const XenTorrentProvider = ({ children, lowBurn = false }: any) => {
  const publicRuntimeConfig = useContext(Web3Context);
  const config = useConfig();
  const supportedNetworks = networks({ config: publicRuntimeConfig });
  const contractABI = publicRuntimeConfig.xenCryptoABI;
  const torrentABI = publicRuntimeConfig.xenTorrentABI;
  const { queryKey } = useBlock();

  const { safeRows: perPage } = useContext(ThemeContext);
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();

  const xenContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });
  const xenTorrentContract = (chain: any) => ({
    address: lowBurn
      ? (Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
          ?.lowBurnMinterAddress as any)
      : (Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
          ?.minterAddress as any),
    abi: torrentABI
  });
  const xenTorrentGenesisBlock = (chain: any) =>
    Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.xenTorrentGenesisBlock;

  const {
    data: ownedTokens,
    refetch: refetchOwnedTokens,
    isFetching: isFetchingOwnedTokens
  } = useReadContract({
    ...xenTorrentContract(chain),
    functionName: 'ownedTokens',
    account: address,
    chainId: chain?.id,
    args: [],
    scopeKey: `xen-torrent-${chain?.id}-${address}-owned-tokens`
  });

  useEffect(() => {
    refetchOwnedTokens();
  }, [chain?.id, address]);

  useEffect(() => {
    // console.log('ownedTokens', ownedTokens);
    if (!ownedTokens) return;

    // setUserTokens([...(ownedTokens as bigint[]).sort(ascending)]);
    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          // eslint-disable-next-line no-return-assign,no-sequences
          ownedTokens,
          tokens: (ownedTokens as bigint[]).reduce((res: any, e: bigint) => {
            res[Number(e)] = {
              ...g?.[chain?.id as number]?.[address as `0x${string}`]?.tokens?.[Number(e)]
            };
            return res;
          }, {})
        }
      }
    }));
  }, [ownedTokens]);

  const { isFetching: isFetchingGlobalData, data: xenftGlobalData } = useReadContracts({
    contracts: [
      { ...xenTorrentContract(chain), functionName: 'genesisTs', chainId: chain?.id },
      { ...xenTorrentContract(chain), functionName: 'startBlockNumber', chainId: chain?.id },
      { ...xenTorrentContract(chain), functionName: 'POWER_GROUP_SIZE', chainId: chain?.id },
      {
        ...xenTorrentContract(chain),
        functionName: 'SPECIAL_CATEGORIES_VMU_THRESHOLD',
        chainId: chain?.id
      },
      { ...xenTorrentContract(chain), functionName: 'tokenIdCounter', chainId: chain?.id }
    ],
    scopeKey: `xen-torrent-${chain?.id}-global-state`
  });

  useEffect(() => {
    if (!xenftGlobalData) return;

    const [
      { result: genesisTs },
      { result: startBlockNumber },
      { result: powerGroupSize },
      { result: specialCategoriesVMUThreshold },
      { result: tokenIdCounter }
    ] = xenftGlobalData as any;
    setGlobal(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        genesisTs,
        startBlockNumber,
        powerGroupSize,
        specialCategoriesVMUThreshold,
        tokenIdCounter
      }
    }));
  }, [xenftGlobalData]);

  // const indexes7 = Array(7).fill(null).map((_,idx) => idx);

  function* tokenClassParams(data: any[] | undefined) {
    if (!data) return;

    let counter = 0;
    while (counter < perPage) {
      const [r0, r1, r2] = data.slice(3 * counter, 3 * (counter + 1));
      yield {
        p0: r0?.result || 0n,
        p1: Number(r1?.result || 0n),
        p2: Number(r2?.result || 0n)
      };
      counter += 1;
    }
  }

  const CLASS_COUNT = 7;
  const { data: xenftClassesData, isFetching: isFetchingClassesData } = useInfiniteReadContracts({
    cacheKey: `xen-torrent-${chain?.id}-categories-data`,
    contracts: pageParam =>
      [...new Array(CLASS_COUNT)]
        .map((_, i) => i)
        .flatMap(
          i =>
            [
              {
                ...xenTorrentContract(chain),
                functionName: 'specialClassesBurnRates',
                chainId: chain?.id,
                args: [BigInt(pageParam + i)]
              },
              {
                ...xenTorrentContract(chain),
                functionName: 'specialClassesTokenLimits',
                chainId: chain?.id,
                args: [BigInt(pageParam + i)]
              },
              {
                ...xenTorrentContract(chain),
                functionName: 'specialClassesCounters',
                chainId: chain?.id,
                args: [BigInt(pageParam + i)]
              }
            ] as const
        ),
    query: {
      enabled: xenTorrentContract(chain)?.address && address && !!chain?.id,
      initialPageParam: 0,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + CLASS_COUNT
    }
  });

  useEffect(() => {
    if (!xenftClassesData) return;
    const { pages, pageParams } = xenftClassesData as any;

    // console.log('xenftClassesData', xenftClassesData);
    const specialClassesBurnRates = [] as bigint[];
    const specialClassesTokenLimits = [] as number[];
    const specialClassesCounters = [] as number[];
    // eslint-disable-next-line no-restricted-syntax
    for (const param of tokenClassParams(pages[pageParams.pop() as number])) {
      specialClassesBurnRates.push(param.p0);
      specialClassesTokenLimits.push(param.p1);
      specialClassesCounters.push(param.p2);
    }
    setGlobal(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        specialClassesBurnRates,
        specialClassesTokenLimits,
        specialClassesCounters
      }
    }));
  }, [xenftClassesData]);

  const { data: xenftUserBalance, isFetching: isFetchingUserBalance } = useReadContract({
    ...xenTorrentContract(chain),
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    account: address,
    chainId: chain?.id,
    scopeKey: `xen-crypto-${chain?.id}-${address}-user-balance`
  });

  useEffect(() => {
    if (!xenftUserBalance) return;

    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          balance: xenftUserBalance
        }
      }
    }));
  }, [xenftUserBalance]);

  const { refetch: refetchAllowance, data: xenftUserAllowance } = useReadContract({
    ...xenContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address as `0x${string}`, xenTorrentContract(chain)?.address],
    chainId: chain?.id,
    scopeKey: `xen-crypto-${chain?.id}-xen-torrent-allowance`
  });

  useEffect(() => {
    if (!xenftUserAllowance) return;

    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          allowance: xenftUserAllowance
        }
      }
    }));
  }, [xenftUserAllowance]);

  // const tokenIds = user[chain?.id as number]?.[address as `0x${string}`]?.ownedTokens || [];

  const toHexString = (n: bigint) => n.toString(16).padStart(64, '0');

  function* tokenInfo(data: any[], tokenIds: bigint[]) {
    let counter = 0;
    while (counter < tokenIds.length) {
      const [r0, r1, r2] = data.slice(3 * counter, 3 * (counter + 1));
      yield {
        ...decodeXenTorrentMintInfo(toHexString(r0?.result || 0n)),
        tokenId: tokenIds[counter],
        // mintInfo: decodeXenTorrentMintInfo(toHexString(r0?.result || 0n)),
        vmuCount: Number(r1?.result),
        image: decodeURI(r2?.result)
      };
      counter += 1;
    }
  }

  const { data: xenftTokenData, isFetching: isFetchingTokenData } = useInfiniteReadContracts({
    cacheKey: `xen-torrent-${chain?.id}:${address}-owned-info`,
    contracts: (index: number) =>
      [...new Array(perPage)]
        .map((_, i) => i)
        .flatMap(
          i =>
            [
              {
                ...xenTorrentContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'mintInfo',
                args: [ownedTokens?.[index * perPage + i]]
              },
              {
                ...xenTorrentContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'vmuCount',
                args: [ownedTokens?.[index * perPage + i]]
              },
              {
                ...xenTorrentContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'tokenURI',
                args: [ownedTokens?.[index * perPage + i]]
              }
            ] as const
        ),
    query: {
      enabled: xenTorrentContract(chain)?.address && address && !!chain?.id && !!ownedTokens,
      initialPageParam: 0,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + perPage
    }
  });

  useEffect(() => {
    if (!xenftTokenData) return;

    // console.log('xenftTokenData', xenftTokenData);
    const { pages, pageParams } = xenftTokenData as any;

    const page: number = (pageParams.slice(-1)[0] || 0) as number;
    const tokenInfos = tokenInfo(
      pages.slice(-1)[0],
      ((ownedTokens || []) as bigint[]).slice(page * perPage, (page + 1) * perPage)
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const info of tokenInfos) {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            tokens: {
              ...g?.[chain?.id as number]?.[address as `0x${string}`]?.tokens,
              [Number(info?.tokenId)]: {
                ...g?.[chain?.id as number]?.[address as `0x${string}`]?.tokens?.[
                  Number(info?.tokenId)
                ],
                ...info
              }
            }
          }
        }
      }));
    }
  }, [xenftTokenData]);

  const publicClient = useClient({ config });

  const { data: logs, isFetching: isFetchingLogs } = useQuery({
    queryKey: [
      'logs-xen-torrent',
      publicClient?.uid,
      address,
      queryKey,
      xenTorrentGenesisBlock(chain)
    ],
    queryFn: () =>
      xenTorrentGenesisBlock(chain)
        ? getLogs(publicClient!, {
            address: xenTorrentContract(chain)?.address,
            fromBlock: BigInt(xenTorrentGenesisBlock(chain)!),
            toBlock: 'latest',
            event: parseAbiItem(
              'event Transfer(address indexed from, address indexed to, uint256 value)'
            ),
            args: { from: zeroAddress, to: address }
          })
        : Promise.resolve(null)
  });

  useEffect(() => {
    if (!logs) return;
    const mintedTokens = (logs || ([] as any)).map((log: any) => BigInt(log?.topics?.[3]));
    console.log('mintedTokens', mintedTokens);

    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          mintedTokens
        }
      }
    }));
  }, [logs]);

  const {
    data: xenftMintedTokenData,
    isFetching: isFetchingMintedTokenData,
    fetchNextPage: fetchNextPageMintedTokenData
  } = useInfiniteReadContracts({
    cacheKey: `xen-torrent-${chain?.id}:${address}-minted-info`,
    contracts: (index: number) => {
      console.log('fetchNextPageMintedTokenData', index);
      return [...new Array(perPage)]
        .map((_, i) => i)
        .flatMap(
          i =>
            [
              {
                ...xenTorrentContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'mintInfo',
                args: [
                  (logs || ([] as any)).map((log: any) => BigInt(log?.topics?.[3]))?.[index + i]
                ]
              },
              {
                ...xenTorrentContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'vmuCount',
                args: [
                  (logs || ([] as any)).map((log: any) => BigInt(log?.topics?.[3]))?.[index + i]
                ]
              },
              {
                ...xenTorrentContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'tokenURI',
                args: [
                  (logs || ([] as any)).map((log: any) => BigInt(log?.topics?.[3]))?.[index + i]
                ]
              }
            ] as const
        );
    },
    query: {
      enabled: xenTorrentContract(chain)?.address && address && !!chain?.id && !!logs,
      initialPageParam: 0,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + perPage
    }
  });

  useEffect(() => {
    if (!xenftMintedTokenData) return;

    console.log('xenftMintedTokenData', xenftMintedTokenData);
    const { pages, pageParams } = xenftMintedTokenData as any;

    const offset: number = (pageParams.slice(-1)[0] || 0) as number;
    const tokenInfos = tokenInfo(
      pages.slice(-1)[0],
      ((logs || ([] as any)).map((log: any) => BigInt(log?.topics?.[3])) as bigint[]).slice(
        offset,
        offset + perPage
      )
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const info of tokenInfos) {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            tokens: {
              ...g?.[chain?.id as number]?.[address as `0x${string}`]?.tokens,
              [Number(info?.tokenId)]: {
                ...g?.[chain?.id as number]?.[address as `0x${string}`]?.tokens?.[
                  Number(info?.tokenId)
                ],
                ...info
              }
            }
          }
        }
      }));
    }
  }, [xenftMintedTokenData]);

  return (
    <XenTorrentContext.Provider
      value={{
        global,
        user,
        setUser,
        isFetching:
          isFetchingOwnedTokens ||
          isFetchingGlobalData ||
          isFetchingGlobalData ||
          isFetchingUserBalance ||
          isFetchingTokenData ||
          isFetchingMintedTokenData ||
          isFetchingLogs,
        refetchAllowance,
        refetchOwnedTokens,
        fetchNextPage: () => console.log('fetchNextPage not implemented'),
        fetchNextPageMintedTokenData
      }}
    >
      {children}
    </XenTorrentContext.Provider>
  );
};
