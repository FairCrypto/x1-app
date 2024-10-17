import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import type { Chain } from 'wagmi/chains';

import { Web3Context } from '@/contexts/Web3';

import networks from '../../config/networks';
import type { TXone, TXoneContext, TXoneUser } from './types';

const initialValue: TXoneContext = {
  global: {},
  user: {},
  isFetching: false,
  refetchUserBalance: () => {},
  refetchXone: () => {},
  refetchUserMints: () => {}
};

export const XoneContext = createContext<TXoneContext>(initialValue);

export const XoneProvider = ({ children }: any) => {
  const publicRuntimeConfig = useContext(Web3Context);
  const supportedNetworks = networks({ config: publicRuntimeConfig });
  const { xoneABI } = publicRuntimeConfig;

  const [global, setGlobal] = useState<Record<number, TXone>>({} as any);
  const [user, setUser] = useState<Record<number, Record<string, TXoneUser>>>({} as any);
  const { address, chain } = useAccount();

  const xoneContract = (chain: (Chain & { unsupported?: boolean | undefined }) | undefined) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.xoneAddress as any,
    abi: xoneABI
  });

  const {
    isFetching,
    refetch: refetchXone,
    data: xoneGlobal
  } = useReadContracts({
    contracts: [
      { ...xoneContract(chain), functionName: 'cap', chainId: chain?.id },
      { ...xoneContract(chain), functionName: 'totalSupply', chainId: chain?.id },
      { ...xoneContract(chain), functionName: 'startBlockNumber', chainId: chain?.id }
    ]
  });

  useEffect(() => {
    const [{ result: cap }, { result: totalSupply }, { result: startBlockNumber }] =
      xoneGlobal as any;
    setGlobal(g => ({
      ...g,
      [chain?.id!]: {
        ...g?.[chain?.id!],
        cap,
        totalSupply,
        startBlockNumber
      } as any
    }));
  }, [xoneGlobal, chain?.id]);

  const { refetch: refetchUserBalance, data: userBalance } = useReadContract({
    ...xoneContract(chain),
    functionName: 'balanceOf',
    args: [address],
    account: address,
    chainId: chain?.id
  });

  useEffect(() => {
    setUser(g => ({
      ...g,
      [chain?.id!]: {
        ...g?.[chain?.id!],
        [address!]: {
          ...g?.[chain?.id!]?.[address!],
          balance: userBalance as unknown as bigint
        }
      }
    }));
  }, [userBalance, chain?.id, address]);

  const { refetch: refetchUserMints, data: userMints } = useReadContract({
    ...xoneContract(chain),
    functionName: 'userMints',
    args: [address],
    account: address,
    chainId: chain?.id
  });

  useEffect(() => {
    setUser(g => ({
      ...g,
      [chain?.id!]: {
        ...g?.[chain?.id!],
        [address!]: {
          ...g?.[chain?.id!]?.[address!],
          minted: userMints as unknown as bigint
        }
      }
    }));
  }, [userMints, chain?.id, address]);

  return (
    <XoneContext.Provider
      value={{
        global,
        user,
        isFetching,
        refetchXone,
        refetchUserBalance,
        refetchUserMints
      }}
    >
      {children}
    </XoneContext.Provider>
  );
};
