import { createContext, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import type { TXenVarStakerContext } from '@/contexts/XenVarStaker/types';

import networks from '../../config/networks';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { xenCryptoABI: contractABI, varStakerABI } = publicRuntimeConfig;

const initialValue: TXenVarStakerContext = {
  global: {},
  user: {},
  setUser: () => {},
  refetchAllowance: () => {},
  refetchStakerInfo: () => {},
  refetchStakerState: () => {},
  refetchStakerPeriod: () => {},
  refetchUser: () => {},
  isFetching: false
};

export const XenVarStakerContext = createContext<TXenVarStakerContext>(initialValue);

export const XenVarStakerProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const { address, chain } = useAccount();

  const varStakerContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.varStakerAddress as any,
    abi: varStakerABI,
    account: address
  });

  const xenContract = (chain: any) => ({
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
      { ...varStakerContract(chain), functionName: 'XEN_YIELD_PCT', chainId: chain?.id },
      { ...varStakerContract(chain), functionName: 'XEN_YIELD_PCT', chainId: chain?.id },
      { ...varStakerContract(chain), functionName: 'genesisTs', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [{ result: xenYieldPct }, { result: periodDurationTs }, { result: genesisTs }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          xenYieldPct,
          periodDurationTs,
          genesisTs
        }
      }));
    }
  });

  /*
    burnerCount: bigint;
    lastBurnPeriod: bigint;
    lastPeriodTs: bigint;
    currentPeriod: bigint;
  */

  const { isFetching: isFetching1, refetch: refetchStakerState } = useContractReads({
    contracts: [
      { ...varStakerContract(chain), functionName: 'burnerCount', chainId: chain?.id },
      { ...varStakerContract(chain), functionName: 'lastBurnPeriod', chainId: chain?.id },
      { ...varStakerContract(chain), functionName: 'lastPeriodTs', chainId: chain?.id },
      { ...varStakerContract(chain), functionName: 'currentPeriod', chainId: chain?.id }
    ],
    onSuccess: sync => {
      const [
        { result: burnerCount },
        { result: lastBurnPeriod },
        { result: lastPeriodTs },
        { result: currentPeriod }
      ] = sync;
      setCurrentPeriod(Number(currentPeriod));
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          burnerCount,
          lastBurnPeriod,
          lastPeriodTs,
          currentPeriod
        }
      }));
    }
  });

  /*
    burns: bigint;
    yields: bigint;
    balances: bigint;
    stakesByPeriod: bigint;
    accStakesByPeriod: bigint;
    accPowerByPeriod: bigint;
    pendingWithdrawalsByPeriod: bigint;
    accPaidByPeriod: bigint;
  */
  const { isFetching: isFetching2, refetch: refetchStakerPeriod } = useContractReads({
    contracts: [
      {
        ...varStakerContract(chain),
        functionName: 'burns',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'yields',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'balances',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'stakesByPeriod',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'accStakesByPeriod',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'accPowerByPeriod',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'pendingWithdrawalsByPeriod',
        chainId: chain?.id,
        args: [currentPeriod]
      },
      {
        ...varStakerContract(chain),
        functionName: 'accPaidByPeriod',
        chainId: chain?.id,
        args: [currentPeriod]
      }
    ],
    onSuccess: period => {
      const [
        { result: burns },
        { result: yields },
        { result: balances },
        { result: stakesByPeriod },
        { result: accStakesByPeriod },
        { result: accPowerByPeriod },
        { result: pendingWithdrawalsByPeriod },
        { result: accPaidByPeriod }
      ] = period;
      setCurrentPeriod(Number(currentPeriod));
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          burns,
          yields,
          balances,
          stakesByPeriod,
          accStakesByPeriod,
          accPowerByPeriod,
          pendingWithdrawalsByPeriod,
          accPaidByPeriod
        }
      }));
    }
  });

  const { refetch: refetchUser } = useContractRead({
    ...varStakerContract(chain),
    functionName: 'stakeCounter',
    args: [address],
    account: address,
    chainId: chain?.id,
    onSuccess: stakeCounter => {
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            stakeCounter
          }
        }
      }));
    }
  });

  const { refetch: refetchAllowance } = useContractRead({
    ...xenContract(chain),
    functionName: 'allowance',
    args: [address, varStakerContract(chain).address],
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

  return (
    <XenVarStakerContext.Provider
      value={{
        global,
        user,
        isFetching: isFetching || isFetching1 || isFetching2,
        setUser,
        refetchUser,
        refetchAllowance,
        refetchStakerInfo,
        refetchStakerState,
        refetchStakerPeriod
      }}
    >
      {children}
    </XenVarStakerContext.Provider>
  );
};
