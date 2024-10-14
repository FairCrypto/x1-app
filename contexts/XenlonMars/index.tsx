import { createContext, useEffect, useState } from 'react';
import {
  paginatedIndexesConfig,
  useAccount,
  useContractInfiniteReads,
  useContractRead,
  useContractReads
} from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import type { TXenlonMarsContext } from '@/contexts/XenlonMars/types';

import networks from '../../config/networks';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { dxnTokenABI } = publicRuntimeConfig;
const { xenlonMarsABI } = publicRuntimeConfig;
const { xlonTokenABI } = publicRuntimeConfig;

const initialValue: TXenlonMarsContext = {
  global: {},
  user: {},
  isFetching: false,
  refetchUserBalance: () => {},
  refetchAllowance: () => {},
  fetchNextPage: () => {},
  getXenlonMarsLeaders: (_: string, __: number) => {},
  getXenlonMarsBurns: (_: number) => {}
};

export const XenlonMarsContext = createContext<TXenlonMarsContext>(initialValue);

export const XenlonMarsProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();

  const xenlonMarsContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.xenlonMarsAddress as any,
    abi: xenlonMarsABI,
    account: address
  });

  const xlonTokenContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.xlonTokenAddress as any,
    abi: xlonTokenABI,
    account: address
  });

  const dxnTokenContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.dxnTokenAddress as any,
    abi: dxnTokenABI
  });

  // burnTimestamps: bigint[];

  const { isFetching } = useContractReads({
    contracts: [
      { ...xenlonMarsContract(chain), functionName: 'initialTimestamp', chainId: chain?.id },
      { ...xenlonMarsContract(chain), functionName: 'XLON_PER_DXN', chainId: chain?.id },
      { ...xenlonMarsContract(chain), functionName: 'totalBurns', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [{ result: genesisTs }, { result: totalBurns }, { result: xlonPerDXN }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          genesisTs,
          totalBurns,
          xlonPerDXN
        }
      }));
    }
  });

  const { fetchNextPage, isFetching: isFetching1 } = useContractInfiniteReads({
    cacheKey: `xenlonMarsBurns:${chain?.id}`,
    enabled: true,
    ...paginatedIndexesConfig(
      (index: number) => [
        {
          ...xenlonMarsContract(chain),
          chainId: chain?.id,
          account: address,
          functionName: 'burnTimestamps',
          args: [index]
        }
      ],
      { start: 0, perPage: 100, direction: 'increment' }
    ),
    onSuccess: data => {
      const page: number = (data.pageParams.slice(-1)[0] || 0) as number;
      // eslint-disable-next-line no-restricted-syntax
      for (const ts of data.pages[page]) {
        setGlobal(g => ({
          ...g,
          [chain?.id]: {
            ...g?.[chain?.id],
            burnTimestamps: [...(g?.[chain?.id]?.burnTimestamps || []), ts?.result]
          }
        }));
      }
    }
  });

  const { refetch: refetchUserBalance } = useContractRead({
    ...xlonTokenContract(chain),
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
    ...dxnTokenContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, xenlonMarsContract(chain)?.address],
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

  const getXenlonMarsLeaders = async (period = 'currentWeek', limit = 10) => {
    const currentNetwork = Object.values(supportedNetworks).find(
      n => Number(n?.chainId) === Number(chain?.id)
    )?.networkId;
    const apiUrl = publicRuntimeConfig.xenApiUrl;
    const queryString = `network=${currentNetwork}&period=${period}&limit=${limit}`;
    const leaders = await fetch(`${apiUrl}/XenlonMars/leaders?${queryString}`)
      .then(r => r.json())
      .catch(_ => []);
    return leaders;
  };

  const getXenlonMarsBurns = async (limit = 10) => {
    const currentNetwork = Object.values(supportedNetworks).find(
      n => Number(n?.chainId) === Number(chain?.id)
    )?.networkId;
    const apiUrl = publicRuntimeConfig.xenApiUrl;
    const queryString = `network=${currentNetwork}&limit=${limit}`;
    const burns = await fetch(`${apiUrl}/XenlonMars/burns?${queryString}`)
      .then(r => r.json())
      .catch(_ => []);
    return burns;
  };

  useEffect(() => {
    getXenlonMarsLeaders().then((leaders: any) => {
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          leaders: leaders.map((l: any) => ({
            minted: BigInt(l.minted || '0'),
            user: l.user
          }))
        }
      }));
    });
  }, []);

  return (
    <XenlonMarsContext.Provider
      value={{
        global,
        user,
        isFetching,
        refetchUserBalance,
        refetchAllowance,
        fetchNextPage,
        getXenlonMarsBurns,
        getXenlonMarsLeaders
      }}
    >
      {children}
    </XenlonMarsContext.Provider>
  );
};
