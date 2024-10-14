import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useContractInfiniteReads, useContractRead, useContractReads } from 'wagmi';

import { paginatedIndexesConfig } from '@/components/wagmi-upgrade/tools';
import { publicRuntimeConfig } from '@/config/runtimeConfig';
import { ThemeContext } from '@/contexts/Theme';

import networks from '../../config/networks';
import { decodeURI, decodeXeNFTStakeInfo } from './decoders';
import type { TXenStakeContext } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const contractABI = publicRuntimeConfig.xenCryptoABI;
const stakeABI = publicRuntimeConfig.xenStakeABI;

const initialValue: TXenStakeContext = {
  global: {},
  user: {},
  isFetching: false,
  setUser: () => {},
  refetchOwnedTokens: () => {},
  refetchAllowance: () => {},
  fetchNextPage: () => {}
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

export const XenStakeContext = createContext<TXenStakeContext>(initialValue);

export const XenStakeProvider = ({ children }) => {
  const { safeRows: perPage } = useContext(ThemeContext);
  const [userTokens, setUserTokens] = useState<bigint[]>([]);
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();

  const xenContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });
  const xenStakeContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.stakerAddress as any,
    abi: stakeABI
  });

  useEffect(() => {
    setUserTokens([]);
  }, [chain?.id, address]);

  const {
    data,
    refetch: refetchOwnedTokens,
    isFetching: isFetching0
  } = useContractRead({
    ...xenStakeContract(chain),
    functionName: 'ownedTokens',
    account: address,
    chainId: chain?.id,
    args: [],
    onSuccess: ownedTokens => {
      setUserTokens([...(ownedTokens as bigint[]).sort(ascending)]);
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            // eslint-disable-next-line no-return-assign,no-sequences
            ownedTokens
          }
        }
      }));
    }
  } as any);

  useEffect(() => {
    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          // eslint-disable-next-line no-return-assign,no-sequences
          tokens: userTokens.reduce((res, e) => {
            res[Number(e)] = {
              ...g?.[chain?.id as number]?.[address as `0x${string}`]?.tokens?.[Number(e)]
            };
            return res;
          }, {})
        }
      }
    }));
  }, [userTokens]);

  const { isFetching: isFetching1 } = useContractReads({
    contracts: [
      { ...xenStakeContract(chain), functionName: 'genesisTs', chainId: chain?.id },
      { ...xenStakeContract(chain), functionName: 'tokenIdCounter', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [{ result: genesisTs }, { result: tokenIdCounter }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          genesisTs,
          tokenIdCounter
        }
      }));
    }
  } as any);

  useContractRead({
    ...xenStakeContract(chain),
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    account: address,
    chainId: chain?.id,
    onSuccess: balance => {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            balance
          }
        }
      }));
    }
  } as any);

  const { refetch: refetchAllowance } = useContractRead({
    ...xenContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, xenStakeContract(chain)?.address],
    chainId: chain?.id,
    onSuccess: allowance => {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            allowance
          }
        }
      }));
    }
  } as any);

  // const tokenIds = user[chain?.id as number]?.[address as `0x${string}`]?.userTokens || [];

  const toHexString = (n: bigint) => n.toString(16).padStart(64, '0');

  function* tokenInfo(data: any[], tokenIds: bigint[]) {
    let counter = 0;
    while (counter < tokenIds.length) {
      const [r0, r1] = data.slice(2 * counter, 2 * (counter + 1));
      yield {
        ...decodeXeNFTStakeInfo(toHexString(r0?.result || 0n)),
        tokenId: tokenIds[counter],
        // stakeInfo: decodeXeNFTStakeInfo(toHexString(r0?.result || 0n)),
        image: decodeURI(r1?.result)
      };
      counter += 1;
    }
  }

  const { fetchNextPage, isFetching: isFetching3 } = useContractInfiniteReads({
    cacheKey: `xenStakeInfo:${chain?.id}:${address}`,
    enabled: false,
    ...paginatedIndexesConfig(
      ((index: number) => {
        if (data?.[index]) {
          const tokenId = data[index];
          return [
            {
              ...xenStakeContract(chain),
              chainId: chain?.id,
              account: address,
              functionName: 'stakeInfo',
              args: [tokenId]
            },
            {
              ...xenStakeContract(chain),
              chainId: chain?.id,
              account: address,
              functionName: 'tokenURI',
              args: [tokenId]
            }
          ];
        }
        return null;
      }) as any,
      { start: 0, perPage, direction: 'increment' }
    ),
    onSuccess: data => {
      const page: number = (data.pageParams.slice(-1)[0] || 0) as number;
      const tokenInfos = tokenInfo(
        data.pages.slice(-1)[0],
        userTokens?.slice(page * perPage, (page + 1) * perPage)
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
    }
  } as any);

  useEffect(() => {
    if (userTokens.length > 0) {
      fetchNextPage({ pageParam: 0 } as any).then(_ => {});
    }
  }, [userTokens]);

  return (
    <XenStakeContext.Provider
      value={{
        global,
        user,
        setUser,
        isFetching: isFetching0 || isFetching3,
        refetchAllowance,
        refetchOwnedTokens,
        fetchNextPage
      }}
    >
      {children}
    </XenStakeContext.Provider>
  );
};
