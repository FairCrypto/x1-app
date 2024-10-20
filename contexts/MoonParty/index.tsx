'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import networks from '@/config/networks';
import type { IMoonPartyContext, TMoonParty, TMoonPartyUser } from '@/contexts/MoonParty/types';
import { Web3Context } from '@/contexts/Web3';

const initState: IMoonPartyContext = {
  global: {} as Record<number, TMoonParty>,
  user: {} as Record<number, Record<Address, TMoonPartyUser>>,
  isFetching: false,
  refetchUser: () => {},
  refetchGlobal: () => {}
};

export const MoonPartyContext = createContext<IMoonPartyContext>(initState);

export const MoonPartyProvider = ({ children }) => {
  const publicRuntimeConfig = useContext(Web3Context);
  // const config = useConfig();
  const supportedNetworks = networks({ config: publicRuntimeConfig });
  const { moonPartyABI } = publicRuntimeConfig;

  const { address, chain } = useAccount();

  const [global, setGlobal] = useState(initState.global);
  const [user, setUser] = useState(initState.user);

  const moonPartyContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.moonPartyAddress as any,
    abi: moonPartyABI
  });

  const {
    isFetching: isFetchingGlobalData,
    data: moonPartyGlobalData,
    refetch: refetchGlobal
  } = useReadContracts({
    contracts: [
      { ...moonPartyContract(chain), functionName: 'DURATION', chainId: chain?.id },
      { ...moonPartyContract(chain), functionName: 'genesisTs', chainId: chain?.id },
      { ...moonPartyContract(chain), functionName: 'amp', chainId: chain?.id },
      { ...moonPartyContract(chain), functionName: 'totalBurnPoints', chainId: chain?.id },
      { ...moonPartyContract(chain), functionName: 'totalAllocatedXNTCredits', chainId: chain?.id }
    ],
    scopeKey: `moon-party-${chain?.id}-global-state`
  });

  useEffect(() => {
    if (!moonPartyGlobalData) return;

    const [
      { result: DURATION },
      { result: genesisTs },
      { result: amp },
      { result: totalBurnPoints },
      { result: totalAllocatedXNTCredits }
    ] = moonPartyGlobalData as any;
    setGlobal(g => ({
      ...g,
      [chain?.id as number]: {
        ...g?.[chain?.id as number],
        endOfParty: (genesisTs + DURATION) * 1_000n,
        amp,
        totalBurnPoints,
        totalAllocatedXNTCredits
      }
    }));
  }, [moonPartyGlobalData]);

  return (
    <MoonPartyContext.Provider
      value={{
        global,
        user,
        isFetching: isFetchingGlobalData,
        refetchUser: () => {},
        refetchGlobal
      }}
    >
      {children}
    </MoonPartyContext.Provider>
  );
};
