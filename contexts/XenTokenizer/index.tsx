import { createContext, useEffect, useState } from 'react';
import {
  useAccount,
  useContractInfiniteReads,
  // useContractRead,
  useContractReads,
} from 'wagmi';

// import {readContract} from "@wagmi/core";
// import {keccak256} from "viem";
import { publicRuntimeConfig } from '@/config/runtimeConfig';
import type { TAddress } from '@/contexts/types';

import networks from '../../config/networks';
import type { TTokenInfo, TXenTokenizerContext } from './types';
import { paginatedIndexesConfig } from '@/components/wagmi-upgrade/tools';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const {
  xenCryptoABI: contractABI,
  tokenizerABI,
  varStakerABI,
  auctionedTokenABI
} = publicRuntimeConfig;

const initialValue: TXenTokenizerContext = {
  global: {},
  user: {},
  isFetching: false,
  setUser: () => {},
  refetchTokenCount: () => {},
  refetchAllTokens: () => {},
  refetchTokenBalances: () => {}
};

export const XenTokenizerContext = createContext<TXenTokenizerContext>(initialValue);

export const XenTokenizerProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const [tokenCount, setTokenCount] = useState(0);
  const [allTokens, setAllTokens] = useState([]);
  const { address, chain } = useAccount();

  const tokenWithAddresses = Object.values(global?.[chain?.id]?.tokens || {}).filter(
    (_: TTokenInfo) => _.address
  );

  const xenContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });
  const xenTokenizerContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.tokenizerAddress as any,
    abi: tokenizerABI
  });
  const xenVarStakerContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.varStakerAddress as any,
    abi: varStakerABI
  });
  const auctionedTokenContract = (chain: any, address: TAddress) => ({
    address,
    abi: auctionedTokenABI
  });

  useEffect(() => {
    setAllTokens([]);
  }, [chain?.id, address]);

  const { isFetching: isFetchingCount, refetch: refetchTokenCount } = useContractReads({
    contracts: [{ ...xenTokenizerContract(chain), functionName: 'tokenCount', chainId: chain?.id }],
    onSuccess: init => {
      const [{ result: tokenCount }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          tokenCount
        }
      }));
      setTokenCount(Number(tokenCount));
    }
  });

  const safeAdd = (arr: string[], item: string) => {
    const set = new Set(arr);
    set.add(item);
    return Array.from(set);
  };

  const { fetchNextPage: refetchAllTokens, isFetching: isFetchingTokens } =
    useContractInfiniteReads({
      cacheKey: `xen-tokenizer-${chain?.id}-all-tokens-info`,
      enabled: false,
      ...paginatedIndexesConfig(
        (index: number) => [
          {
            ...xenTokenizerContract(chain),
            chainId: chain?.id,
            functionName: 'allTokens',
            args: [index]
          }
        ],
        { start: 0, perPage: tokenCount, direction: 'increment' }
      ),
      onSuccess: data => {
        const page: number = (data.pageParams.slice(-1)[0] || 0) as number;
        // eslint-disable-next-line no-restricted-syntax
        for (const info of data.pages[page]) {
          if (info.status === 'success') {
            setGlobal(g => ({
              ...g,
              [chain?.id]: {
                ...g?.[chain?.id],
                allTokens: safeAdd(g?.[chain?.id]?.allTokens, info.result?.toString())
              }
            }));
          }
        }
      }
    });

  const { fetchNextPage, isFetching: isFetchingTokenInfo } = useContractInfiniteReads({
    cacheKey: `xen-tokenizer-${chain?.id}-token-info`,
    enabled: false,
    ...paginatedIndexesConfig(
      (index: number) => {
        if (allTokens[index]) {
          const tokenSymbol = allTokens[index];
          return [
            {
              ...xenTokenizerContract(chain),
              chainId: chain?.id,
              account: address,
              functionName: 'getTokenInfo',
              args: [tokenSymbol]
            }
          ];
        }
        return null;
      },
      { start: 0, perPage: tokenCount, direction: 'increment' }
    ),
    onSuccess: data => {
      const page: number = (data.pageParams.slice(-1)[0] || 0) as number;
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < data.pages[page].length; i++) {
        const info = data.pages[page][i];
        if (info.status === 'success') {
          setGlobal(g => ({
            ...g,
            [chain?.id]: {
              ...g?.[chain?.id],
              tokens: {
                ...g?.[chain?.id]?.tokens,
                [allTokens[i]]: {
                  ...g?.[chain?.id]?.tokens?.[allTokens[i]],
                  address: info.result[0],
                  deployer: info.result[1],
                  burns: info.result[2]
                }
              }
            }
          }));
        }
      }
    }
  });

  const { fetchNextPage: fetchTokenData, isFetching: isFetchingTokenData } =
    useContractInfiniteReads({
      cacheKey: `xen-tokenizer-${chain?.id}-token-data`,
      enabled: false,
      ...paginatedIndexesConfig(
        (index: number) => {
          const tokenAddress = global[chain?.id]?.tokens?.[allTokens[index]]?.address;
          if (allTokens[index] && tokenAddress) {
            return [
              {
                ...auctionedTokenContract(chain, tokenAddress),
                chainId: chain?.id,
                functionName: 'name',
                args: []
              },
              {
                ...auctionedTokenContract(chain, tokenAddress),
                chainId: chain?.id,
                functionName: 'totalSupply',
                args: []
              },
              {
                ...auctionedTokenContract(chain, tokenAddress),
                chainId: chain?.id,
                functionName: 'cap',
                args: []
              }
            ];
          }
          return null;
        },
        { start: 0, perPage: tokenCount, direction: 'increment' }
      ),
      onSuccess: data => {
        const page: number = (data.pageParams.slice(-1)[0] || 0) as number;
        // eslint-disable-next-line no-restricted-syntax
        for (let i = 0; i < data.pages[page].length / 3; i++) {
          const { status: s1, result: name } = data.pages[page][i * 3];
          const { status: s2, result: totalSupply } = data.pages[page][i * 3 + 1];
          const { status: s3, result: cap } = data.pages[page][i * 3 + 2];
          if (s1 === 'success' && s2 === 'success' && s3 === 'success') {
            setGlobal(g => ({
              ...g,
              [chain?.id]: {
                ...g?.[chain?.id],
                tokens: {
                  ...g?.[chain?.id]?.tokens,
                  [allTokens[i]]: {
                    ...g?.[chain?.id]?.tokens?.[allTokens[i]],
                    name,
                    totalSupply,
                    cap
                  }
                }
              }
            }));
          }
        }
      }
    });

  const refetchTokenBalances = () => {};

  useEffect(() => {
    if (tokenCount > 0n) {
      refetchAllTokens({ pageParam: 0 }).then(_ => {});
    }
  }, [tokenCount]);

  useEffect(() => {
    setAllTokens(global?.[chain?.id]?.allTokens || []);
  }, [global?.[chain?.id]?.allTokens]);

  useEffect(() => {
    if (allTokens?.length > 0) {
      fetchNextPage({ pageParam: 0 }).then(_ => {});
    }
  }, [allTokens]);

  useEffect(() => {
    if (tokenWithAddresses.length > 0) {
      fetchTokenData({ pageParam: 0 }).then(__ => {});
    }
  }, [tokenWithAddresses.length]);

  return (
    <XenTokenizerContext.Provider
      value={{
        global,
        user,
        setUser,
        isFetching: isFetchingTokens || isFetchingTokenInfo,
        refetchTokenCount,
        refetchAllTokens,
        refetchTokenBalances
      }}
    >
      {children}
    </XenTokenizerContext.Provider>
  );
};
