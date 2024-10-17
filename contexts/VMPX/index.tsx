import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import type { Chain } from 'wagmi/chains';

import { Web3Context } from '@/contexts/Web3';

import networks from '../../config/networks';
import type { TVmpx, TVmpxContext, TVmpxUser } from './types';

const initialValue: TVmpxContext = {
  global: {},
  user: {},
  isFetching: false,
  refetchUserBalance: () => {},
  refetchVmpx: () => {}
};

export const VmpxContext = createContext<TVmpxContext>(initialValue);

export const VmpxProvider = ({ children }: any) => {
  const publicRuntimeConfig = useContext(Web3Context);
  const supportedNetworks = networks({ config: publicRuntimeConfig });
  const contractABI = publicRuntimeConfig.vmpxABI;

  const [global, setGlobal] = useState<Record<number, TVmpx>>({} as any);
  const [user, setUser] = useState<Record<number, Record<string, TVmpxUser>>>({} as any);
  const { address, chain } = useAccount();

  const vmpxContract = (chain: (Chain & { unsupported?: boolean | undefined }) | undefined) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });

  const {
    isFetching,
    refetch: refetchVmpx,
    data: globalState
  } = useReadContracts({
    contracts: [
      { ...vmpxContract(chain), functionName: 'cap', chainId: chain?.id },
      { ...vmpxContract(chain), functionName: 'cycles', chainId: chain?.id },
      { ...vmpxContract(chain), functionName: 'counter', chainId: chain?.id },
      { ...vmpxContract(chain), functionName: 'BATCH', chainId: chain?.id },
      { ...vmpxContract(chain), functionName: 'totalSupply', chainId: chain?.id },
      { ...vmpxContract(chain), functionName: 'startBlockNumber', chainId: chain?.id }
    ]
  });

  useEffect(() => {
    const [
      { result: cap },
      { result: cycles },
      { result: counter },
      { result: batch },
      { result: totalSupply },
      { result: startBlockNumber }
    ] = globalState as any;
    setGlobal(g => ({
      ...g,
      [chain?.id!]: {
        ...g?.[chain?.id!],
        cap,
        cycles,
        counter,
        batch,
        totalSupply,
        startBlockNumber
      } as any
    }));
  }, [globalState, chain]);

  const { refetch: refetchUserBalance, data: userBalance } = useReadContract({
    ...vmpxContract(chain),
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
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
  }, [chain, address, userBalance]);

  return (
    <VmpxContext.Provider
      value={{
        global,
        user,
        isFetching,
        refetchVmpx,
        refetchUserBalance
      }}
    >
      {children}
    </VmpxContext.Provider>
  );
};
