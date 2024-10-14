import { createContext, useContext, useEffect, useState } from 'react';
import type { Chain } from 'wagmi';
import { useAccount, useContractInfiniteReads, useContractRead, useContractReads } from 'wagmi';

import { paginatedIndexesConfig } from '@/components/wagmi-upgrade/tools';
import { publicRuntimeConfig } from '@/config/runtimeConfig';
import { ThemeContext } from '@/contexts/Theme';
import type { TAddress } from '@/contexts/types';
import type { TXEth, TXEthContext, TXEthUser } from '@/contexts/XEth/types';

import networks from '../../config/networks';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { xenCryptoABI: contractABI, xEthABI } = publicRuntimeConfig;

const initialValue: TXEthContext = {
  global: {} as Record<number, TXEth>,
  user: {} as Record<number, Record<TAddress, TXEthUser>>,
  setUser: () => {},
  refetchBalance: () => {},
  refetchAllowance: () => {},
  refetchUserStakeIds: () => {},
  refetchUserXenStakes: () => {},
  isFetching: false
};

export const XEthContext = createContext<TXEthContext>(initialValue);
const LIDO_TOKEN_ID0 = 340282366920938463463374607431768211456n;

export const XEthProvider = ({ children }) => {
  const { safeRows: perPage } = useContext(ThemeContext);
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const [tokenIds, setTokenIds] = useState([]);
  const { address, chain } = useAccount();

  const xEthContract = (chain: Chain) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.xEthAddress as any,
    abi: xEthABI,
    account: address
  });

  const xenContract = (chain: Chain) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });

  /*
    xenYieldPct: bigint; // XEN_YIELD_PCT
    periodDurationTs: bigint; // XEN_YIELD_PCT
    genesisTs: bigint;
   */
  const { isFetching, refetch: refetchStakerInfo } = useContractReads({
    contracts: [
      { ...xEthContract(chain), functionName: 'MIN_STAKE_TERM', chainId: chain?.id },
      { ...xEthContract(chain), functionName: 'stakeIdCounter', chainId: chain?.id },
      { ...xEthContract(chain), functionName: 'xenPairFee', chainId: chain?.id },
      { ...xEthContract(chain), functionName: 'totalSupply', chainId: chain?.id },
      { ...xEthContract(chain), functionName: 'LIDO_STAKE_ID_START', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [
        { result: minStakeTerm },
        { result: stakeIdCounter },
        { result: xenPairFee },
        { result: totalSupply },
        { result: lidoStakeOffset }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          minStakeTerm,
          stakeIdCounter,
          xenPairFee,
          totalSupply,
          lidoStakeOffset
        }
      }));
    }
  });

  /*
    mapping(address => uint256[]) public stakeIds;
    mapping(address => mapping(uint256 => uint256)) public xenStakes;
  */

  const {
    refetch: refetchUserStakeIds,
    isFetching: isFetching2,
    data: stakeIds
  } = useContractRead({
    ...xEthContract(chain),
    functionName: 'userStakeIds',
    args: [],
    account: address,
    chainId: chain?.id,
    onSuccess: stakeIds => {
      setTokenIds(stakeIds);
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            stakeIds
          }
        }
      }));
    }
  });

  const { refetch: refetchBalance } = useContractRead({
    ...xEthContract(chain),
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
    args: [address, xEthContract(chain).address],
    account: address,
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

  const { fetchNextPage: refetchUserXenStakes, isFetching: isFetching3 } = useContractInfiniteReads(
    {
      cacheKey: `xeth-${chain?.id}:${address}-stakeIds`,
      enabled: false,
      ...paginatedIndexesConfig(
        (index: number) => {
          if (stakeIds?.[index]) {
            const tokenId = stakeIds[index];
            return [
              {
                ...xEthContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'xenStakes',
                args: [address, tokenId]
              },
              {
                ...xEthContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'userStakeInfo',
                args: [tokenId]
              },
              {
                ...xEthContract(chain),
                chainId: chain?.id,
                account: address,
                functionName: 'unlockTs',
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
        const results = data.pages.slice(-1)[0];
        // eslint-disable-next-line no-restricted-syntax
        for (const stakeId of tokenIds) {
          setUser(g => ({
            ...g,
            [chain?.id]: {
              ...g?.[chain?.id],
              [address]: {
                ...g?.[chain?.id]?.[address],
                xenStakes: {
                  ...g?.[chain?.id]?.[address]?.xenStakes,
                  [stakeId]: results[tokenIds.indexOf(stakeId) * 3].result
                },
                stakeInfo: {
                  ...g?.[chain?.id]?.[address]?.stakeInfo,
                  [stakeId]:
                    stakeId < LIDO_TOKEN_ID0
                      ? results[tokenIds.indexOf(stakeId) * 3 + 1].result
                      : [0n, results[tokenIds.indexOf(stakeId) * 3 + 2].result, 0n, 0n]
                }
              }
            }
          }));
        }
      }
    }
  );

  useEffect(() => {
    if (tokenIds.length > 0) {
      // const pageParam = Math.ceil(ownedTokens.length / perPage);
      refetchUserXenStakes({ pageParam: 0 }).then(_ => {});
    }
  }, [tokenIds]);

  return (
    <XEthContext.Provider
      value={{
        global,
        user,
        isFetching: isFetching || isFetching2 || isFetching3,
        setUser,
        refetchAllowance,
        refetchBalance,
        refetchUserStakeIds,
        refetchUserXenStakes
      }}
    >
      {children}
    </XEthContext.Provider>
  );
};
