import { createContext, useContext, useEffect, useState } from 'react';
import {
  useAccount,
  useContractInfiniteReads,
  useContractRead,
  useContractReads,
} from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import { ThemeContext } from '@/contexts/Theme';

import networks from '../../config/networks';
import { decodeURI, decodeXenTickerInfo } from './decoders';
import type { TXenTickerContext } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const contractABI = publicRuntimeConfig.xenCryptoABI;
const tickerABI = publicRuntimeConfig.xenTickerABI;

const initialValue: TXenTickerContext = {
  global: {},
  user: {},
  isFetching: false,
  setUser: () => {},
  refetchOwnedTokens: () => {},
  refetchAllowance: () => {},
  fetchNextPage: () => {}
};

export const XenTickerContext = createContext<TXenTickerContext>(initialValue);

export const XenTickerProvider = ({ children }) => {
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
  const xenTickerContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.tickerAddress as any,
    abi: tickerABI
  });

  useEffect(() => {
    setUserTokens([]);
  }, [chain?.id, address]);

  const {
    data,
    refetch: refetchOwnedTokens,
    isFetching: isFetching0
  } = useContractRead({
    ...xenTickerContract(chain),
    functionName: 'ownedTokens',
    account: address,
    chainId: chain?.id,
    args: [],
    onSuccess: ownedTokens => {
      setUserTokens(ownedTokens as any);
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            ownedTokens
          }
        }
      }));
    }
  });

  useEffect(() => {
    setUser(g => ({
      ...g,
      [chain?.id]: {
        ...g?.[chain?.id],
        [address]: {
          ...g?.[chain?.id]?.[address],
          // eslint-disable-next-line no-return-assign,no-sequences
          tokens: userTokens.reduce((res, e) => {
            res[Number(e)] = {
              ...g?.[chain?.id]?.[address]?.tokens?.[Number(e)]
            };
            return res;
          }, {})
        }
      }
    }));
  }, [userTokens]);

  const { isFetching: isFetching1 } = useContractReads({
    contracts: [
      { ...xenTickerContract(chain), functionName: 'getRequiredXenBurnAmount', chainId: chain?.id },
      { ...xenTickerContract(chain), functionName: 'tokenIdCounter', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [{ result: xenBurnRequired }, { result: tokenIdCounter }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          xenBurnRequired,
          tokenIdCounter
        }
      }));
    }
  });

  const { isFetching: isFetching2 } = useContractReads({
    contracts: [
      { ...xenTickerContract(chain), functionName: 'XEN_BURN_FLOOR', chainId: chain?.id },
      { ...xenTickerContract(chain), functionName: 'XEN_BURN_STEP', chainId: chain?.id },
      { ...xenTickerContract(chain), functionName: 'COUNTER_STEPS', chainId: chain?.id },
      { ...xenTickerContract(chain), functionName: 'TICKER_LENGTH', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [
        { result: xenBurnFloor },
        { result: xenBurnStep },
        { result: counterSteps },
        { result: tickerLength }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          xenBurnFloor,
          xenBurnStep,
          counterSteps,
          tickerLength
        }
      }));
    }
  });

  useContractRead({
    ...xenTickerContract(chain),
    functionName: 'balanceOf',
    args: [address],
    account: address,
    chainId: chain?.id,
    onSuccess: balance => {
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            balance
          }
        }
      }));
    }
  });

  const { refetch: refetchAllowance } = useContractRead({
    ...xenContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, xenTickerContract(chain)?.address],
    chainId: chain?.id,
    onSuccess: allowance => {
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            allowance
          }
        }
      }));
    }
  });

  // const tokenIds = user[chain?.id]?.[address]?.userTokens || [];

  const toHexString = (n: bigint) => n.toString(16).padStart(64, '0');

  function* tokenInfo(data: any[], tokenIds: bigint[]) {
    let counter = 0;
    while (counter < tokenIds.length) {
      const [r0, r1] = data.slice(2 * counter, 2 * (counter + 1));
      yield {
        ...decodeXenTickerInfo(toHexString(r0?.result || 0n)),
        tokenId: tokenIds[counter],
        image: decodeURI(r1?.result)
      };
      counter += 1;
    }
  }

  const { fetchNextPage, isFetching: isFetching3 } = useContractInfiniteReads({
    cacheKey: `xen-ticker-info-${chain?.id}:${address}`,
    enabled: false,
    ...paginatedIndexesConfig(
      (index: number) => {
        if (data?.[index]) {
          const tokenId = data[index];
          return [
            {
              ...xenTickerContract(chain),
              chainId: chain?.id,
              account: address,
              functionName: 'tickerInfo',
              args: [tokenId]
            },
            {
              ...xenTickerContract(chain),
              chainId: chain?.id,
              account: address,
              functionName: 'tokenURI',
              args: [tokenId]
            }
          ];
        }
        return null;
      },
      { start: 0, perPage, direction: 'increment' }
    ),
    onSuccess: data => {
      const page: number = (data.pageParams.slice(-1)[0] || 0) as number;
      // eslint-disable-next-line no-restricted-syntax
      for (const info of tokenInfo(
        data.pages.slice(-1)[0],
        userTokens?.slice(page * perPage, (page + 1) * perPage)
      )) {
        setUser(g => ({
          ...g,
          [chain?.id]: {
            ...g?.[chain?.id],
            [address]: {
              ...g?.[chain?.id]?.[address],
              tokens: {
                ...g?.[chain?.id]?.[address]?.tokens,
                [Number(info?.tokenId)]: {
                  ...g?.[chain?.id]?.[address]?.tokens?.[Number(info?.tokenId)],
                  ...info
                }
              }
            }
          }
        }));
      }
    }
  });

  useEffect(() => {
    if (userTokens.length > 0) {
      fetchNextPage({ pageParam: 0 });
    }
  }, [userTokens]);

  return (
    <XenTickerContext.Provider
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
    </XenTickerContext.Provider>
  );
};
