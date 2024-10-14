'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { type Chain } from 'wagmi/chains';

import { Web3Context } from '@/contexts/Web3';

import networks from '../../config/networks';
import type { TXenCrypto, TXenCryptoContext, TXenCryptoUser } from './types';

const initialValue: TXenCryptoContext = {
  global: {} as Record<number, TXenCrypto>,
  user: {} as Record<number, Record<string, TXenCryptoUser>>,
  isFetching: false,
  refetchUserBalance: () => {},
  refetchUserMint: () => {},
  refetchUserStake: () => {},
  refetchUserBurns: () => {}
};

export const XenCryptoContext = createContext<TXenCryptoContext>(initialValue);

export const XenCryptoProvider = ({ children }) => {
  const publicRuntimeConfig = useContext(Web3Context);
  const supportedNetworks = networks({ config: publicRuntimeConfig });
  const contractABI = publicRuntimeConfig.xenCryptoABI;

  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();
  const xenContract = (chain: Chain | undefined) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });

  const { isFetching: isFetchingGlobalXenData, data: globalXenData } = useReadContracts({
    contracts: [
      { ...xenContract(chain), functionName: 'genesisTs', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'getCurrentMaxTerm', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'getCurrentAMP', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'getCurrentEAAR', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'getCurrentAPY', chainId: chain?.id }
    ]
  });

  useEffect(() => {
    if (!globalXenData) return;
    const [
      { result: genesisTs },
      { result: currentMaxTerm },
      { result: currentAMP },
      { result: currentEAA },
      { result: currentAPY }
    ] = globalXenData as any;
    setGlobal(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        genesisTs,
        currentMaxTerm,
        currentAMP,
        currentEAA,
        currentAPY
      }
    }));
  }, [globalXenData]);

  const { isFetching: isFetchingGlobalXenState, data: globalXenState } = useReadContracts({
    contracts: [
      { ...xenContract(chain), functionName: 'globalRank', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'totalSupply', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'activeMinters', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'activeStakes', chainId: chain?.id },
      { ...xenContract(chain), functionName: 'totalXenStaked', chainId: chain?.id }
    ]
  });

  useEffect(() => {
    if (!globalXenState) return;
    const [
      { result: globalRank },
      { result: totalSupply },
      { result: activeMinters },
      { result: activeStakes },
      { result: totalXenStaked }
    ] = globalXenState as any;
    setGlobal(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        globalRank,
        totalSupply,
        activeMinters,
        activeStakes,
        totalXenStaked
      }
    }));
  }, [globalXenState]);

  const {
    refetch: refetchUserBalance,
    data: xenUserBalance,
    isFetching: isFetchingUserBalance
  } = useReadContract({
    ...xenContract(chain),
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    account: address,
    chainId: chain?.id
  });

  useEffect(() => {
    if (!xenUserBalance) return;
    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          balance: xenUserBalance
        }
      }
    }));
  }, [xenUserBalance]);

  const {
    refetch: refetchUserBurns,
    data: xenUserBurns,
    isFetching: isFetchingUserBurns
  } = useReadContract({
    ...xenContract(chain),
    functionName: 'userBurns',
    args: [address as `0x${string}`],
    account: address,
    chainId: chain?.id
  });

  useEffect(() => {
    console.log('xenUserBurns', xenUserBurns);
    if (!xenUserBurns) return;
    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          userBurns: xenUserBurns
        }
      }
    }));
  }, [xenUserBurns]);

  const {
    refetch: refetchUserMint,
    data: xenUserMintInfo,
    isFetching: isFetchingUserMint
  } = useReadContract({
    ...xenContract(chain),
    functionName: 'getUserMint',
    account: address,
    chainId: chain?.id
  });

  useEffect(() => {
    if (!xenUserMintInfo) return;
    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          mintInfo: xenUserMintInfo
        }
      }
    }));
  }, [xenUserMintInfo]);

  const {
    refetch: refetchUserStake,
    data: xenUserStakeInfo,
    isFetching: isFetchingUserStake
  } = useReadContract({
    ...xenContract(chain),
    functionName: 'getUserStake',
    account: address,
    chainId: chain?.id
  });

  useEffect(() => {
    if (!xenUserStakeInfo) return;
    setUser(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        [address as `0x${string}`]: {
          ...g?.[chain?.id as number]?.[address as `0x${string}`],
          stakeInfo: xenUserStakeInfo
        }
      }
    }));
  }, [xenUserStakeInfo]);

  useEffect(() => {
    // refetchUserBurns();
    // refetchUserBalance();
    // refetchUserMint();
    // refetchUserStake();
  }, [address as `0x${string}`]);

  return (
    <XenCryptoContext.Provider
      value={{
        global,
        user,
        isFetching: isFetchingGlobalXenData || isFetchingGlobalXenState || isFetchingUserBalance,
        refetchUserBalance,
        refetchUserMint,
        refetchUserStake,
        refetchUserBurns
      }}
    >
      {children}
    </XenCryptoContext.Provider>
  );
};
