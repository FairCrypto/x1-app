import { createContext, useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';

import networks from '../../config/networks';
import type { TDBXenContext } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const contractABI = publicRuntimeConfig.xenCryptoABI;
const { dbXenABI } = publicRuntimeConfig;
const { dbXenViewsABI } = publicRuntimeConfig;
const { dxnTokenABI } = publicRuntimeConfig;

const initialValue: TDBXenContext = {
  global: {},
  user: {},
  isFetching: false,
  refetchUserBalance: () => {},
  refetchAllowance: () => {},
  refetchDXNAllowance: () => {},
  refetchUserState: () => {},
  refetchStakeInfo: () => {}
};

export const DBXenContext = createContext<TDBXenContext>(initialValue);

export const DBXenProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();

  const currentStartedCycle = global[chain?.id]?.currentStartedCycle;
  const firstStakeCycle = user[chain?.id]?.[address]?.firstStakeCycle;
  const secondStakeCycle = user[chain?.id]?.[address]?.secondStakeCycle;

  const xenCryptoContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });

  const dbXenContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.dbXenAddress as any,
    abi: dbXenABI
  });

  const dbXenViewsContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.dbXenViewsAddress as any,
    abi: dbXenViewsABI,
    account: address
  });

  const dxnTokenContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.dxnTokenAddress as any,
    abi: dxnTokenABI
  });

  const { isFetching } = useContractReads({
    contracts: [
      { ...dbXenContract(chain), functionName: 'MAX_BPS', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'SCALING_FACTOR', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'XEN_BATCH_AMOUNT', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'i_periodDuration', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'i_initialTimestamp', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'currentCycle', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'currentStartedCycle', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'lastStartedCycle', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'previousStartedCycle', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'currentCycleReward', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'lastCycleReward', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'totalNumberOfBatchesBurned', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'pendingFees', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'pendingStake', chainId: chain?.id },
      { ...dbXenContract(chain), functionName: 'pendingStakeWithdrawal', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [
        { result: maxBPS },
        { result: scalingFactor },
        { result: xenBatchAmount },
        { result: periodDuration },
        { result: genesisTs },
        { result: currentCycle },
        { result: currentStartedCycle },
        { result: lastStartedCycle },
        { result: previousStartedCycle },
        { result: currentCycleReward },
        { result: lastCycleReward },
        { result: totalNumberOfBatchesBurned },
        { result: pendingFees },
        { result: pendingStake },
        { result: pendingStakeWithdrawal }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          maxBPS,
          scalingFactor,
          xenBatchAmount,
          periodDuration,
          genesisTs,
          currentCycle,
          currentStartedCycle,
          lastStartedCycle,
          previousStartedCycle,
          currentCycleReward,
          lastCycleReward,
          totalNumberOfBatchesBurned,
          pendingFees,
          pendingStake,
          pendingStakeWithdrawal
        }
      }));
    }
  });

  const { refetch: refetchUserState } = useContractReads({
    contracts: [
      {
        ...dbXenContract(chain),
        functionName: 'accCycleBatchesBurned',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenViewsContract(chain),
        functionName: 'getUnclaimedFees',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenContract(chain),
        functionName: 'accFirstStake',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenContract(chain),
        functionName: 'accSecondStake',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenContract(chain),
        functionName: 'accFirstStake',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenViewsContract(chain),
        functionName: 'getUnclaimedRewards',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenContract(chain),
        functionName: 'accSecondStake',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenViewsContract(chain),
        functionName: 'getAccWithdrawableStake',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenContract(chain),
        functionName: 'lastActiveCycle',
        chainId: chain?.id,
        args: [address]
      },
      {
        ...dbXenContract(chain),
        functionName: 'lastFeeUpdateCycle',
        chainId: chain?.id,
        args: [address]
      }
    ],
    onSuccess: init => {
      const [
        { result: accCycleBatchesBurned },
        { result: accAccruedFees },
        { result: firstStakeCycle },
        { result: secondStakeCycle },
        { result: accFirstStake },
        { result: accRewards },
        { result: accSecondStake },
        { result: accWithdrawableStake },
        { result: lastActiveCycle },
        { result: lastFeeUpdateCycle }
      ] = init;
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            accCycleBatchesBurned,
            accAccruedFees,
            firstStakeCycle,
            secondStakeCycle,
            accFirstStake,
            accRewards,
            accSecondStake,
            accWithdrawableStake,
            lastActiveCycle,
            lastFeeUpdateCycle
          }
        }
      }));
    }
  });

  const { isFetching: isFetchingStakeInfo, refetch: refetchStakeInfo } = useContractReads({
    contracts: [
      {
        ...dbXenContract(chain),
        functionName: 'cycleTotalBatchesBurned',
        chainId: chain?.id,
        args: [currentStartedCycle]
      },
      {
        ...dbXenContract(chain),
        functionName: 'accStakeCycle',
        chainId: chain?.id,
        args: [address, firstStakeCycle]
      },
      {
        ...dbXenContract(chain),
        functionName: 'accStakeCycle',
        chainId: chain?.id,
        args: [address, secondStakeCycle]
      }
    ],
    onSuccess: init => {
      const [
        { result: cycleTotalBatchesBurned },
        { result: firstStakeCycleAmount },
        { result: secondStakeCycleAmount }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          cycleTotalBatchesBurned
        }
      }));
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            firstStakeCycleAmount,
            secondStakeCycleAmount
          }
        }
      }));
    }
  });

  useEffect(() => {
    if (currentStartedCycle) {
      refetchStakeInfo().then(() => {
        //
      });
    }
  }, [currentStartedCycle]);

  useEffect(() => {
    if (firstStakeCycle && secondStakeCycle) {
      refetchStakeInfo().then(() => {
        //
      });
    }
  }, [firstStakeCycle, secondStakeCycle]);

  const { refetch: refetchUserBalance } = useContractRead({
    ...dxnTokenContract(chain),
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
    ...xenCryptoContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, dbXenContract(chain)?.address],
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

  const { refetch: refetchDXNAllowance } = useContractRead({
    ...dxnTokenContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, dbXenContract(chain)?.address],
    chainId: chain?.id,
    onSuccess: allowanceDXN => {
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...g?.[chain?.id]?.[address],
            allowanceDXN
          }
        }
      }));
    }
  });

  return (
    <DBXenContext.Provider
      value={{
        global,
        user,
        isFetching,
        refetchUserState,
        refetchStakeInfo,
        refetchUserBalance,
        refetchAllowance,
        refetchDXNAllowance
      }}
    >
      {children}
    </DBXenContext.Provider>
  );
};
