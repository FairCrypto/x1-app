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
import { decodeURI, decodeXenBurnInfo } from './decoders';
import type { TXenBurnContext } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const contractABI = publicRuntimeConfig.xenCryptoABI;
const burnABI = publicRuntimeConfig.xenBurnABI;

const initialValue: TXenBurnContext = {
  global: {},
  user: {},
  isFetching: false,
  setUser: () => {},
  refetchOwnedTokens: () => {},
  refetchAllowance: () => {},
  fetchNextPage: () => {}
};

export const XenBurnContext = createContext<TXenBurnContext>(initialValue);

export const XenBurnProvider = ({ children }) => {
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
  const xenBurnContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.burnerAddress as any,
    abi: burnABI
  });

  useEffect(() => {
    setUserTokens([]);
  }, [chain?.id, address]);

  const {
    data,
    refetch: refetchOwnedTokens,
    isFetching: isFetching0
  } = useContractRead({
    ...xenBurnContract(chain),
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
      // { ...xenBurnContract(chain), functionName: 'genesisTs', chainId: chain?.id },
      { ...xenBurnContract(chain), functionName: 'tokenIdCounter', chainId: chain?.id },
      { ...xenBurnContract(chain), functionName: 'DEFAULT_POOL_FEE', chainId: chain?.id },
      { ...xenBurnContract(chain), functionName: 'MIN_VALUE', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [{ result: tokenIdCounter }, { result: defaultPoolFee }, { result: minValue }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          tokenIdCounter,
          defaultPoolFee,
          minValue
        }
      }));
    }
  });

  useContractRead({
    ...xenBurnContract(chain),
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
    args: [address, xenBurnContract(chain)?.address],
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
        ...decodeXenBurnInfo(toHexString(r0?.result || 0n)),
        tokenId: tokenIds[counter],
        image: decodeURI(r1?.result)
      };
      counter += 1;
    }
  }

  const { fetchNextPage, isFetching: isFetching3 } = useContractInfiniteReads({
    cacheKey: `xen-burn-info-${chain?.id}:${address}`,
    enabled: false,
    ...paginatedIndexesConfig(
      (index: number) => {
        if (data?.[index]) {
          const tokenId = data[index];
          return [
            {
              ...xenBurnContract(chain),
              chainId: chain?.id,
              account: address,
              functionName: 'burnInfo',
              args: [tokenId]
            },
            {
              ...xenBurnContract(chain),
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
      fetchNextPage({ pageParam: 0 }).then(_ => {});
    }
  }, [userTokens]);

  return (
    <XenBurnContext.Provider
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
    </XenBurnContext.Provider>
  );
};
