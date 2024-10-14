import { createContext, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import type { TAddress } from '@/contexts/types';
import type { TXHeX, TXHeXContext, TXHeXUser } from '@/contexts/XHeX/types';

import networks from '../../config/networks';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { xHexABI } = publicRuntimeConfig;

const initialValue: TXHeXContext = {
  global: {} as Record<number, TXHeX>,
  user: {} as Record<number, Record<TAddress, TXHeXUser>>,
  setUser: () => {},
  refetchTokenState: () => {},
  refetchBalance: () => {},
  isFetching: false
};

export const XHeXContext = createContext<TXHeXContext>(initialValue);

export const XHeXProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();
  const xHeXContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.xHexAddress as any,
    abi: xHexABI,
    account: address
  });

  const { isFetching, refetch: refetchTokenState } = useContractReads({
    contracts: [
      { ...xHeXContract(chain), functionName: 'totalSupply', chainId: chain?.id },
      // { ...xHeXContract(chain), functionName: 'cap', chainId: chain?.id },
      // { ...xHeXContract(chain), functionName: 'startBlockNumber', chainId: chain?.id },
      // { ...xHeXContract(chain), functionName: 'DURATION_BLOCKS', chainId: chain?.id },
      // { ...xHeXContract(chain), functionName: 'LIMIT_PER_ACCOUNT', chainId: chain?.id },
      { ...xHeXContract(chain), functionName: 'paused', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [
        { result: totalSupply },
        // { result: cap },
        // { result: startBlockNumber },
        // { result: durationBlocks },
        // { result: limitPerAccount },
        { result: paused }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          totalSupply,
          // cap,
          // startBlockNumber,
          // durationBlocks,
          // limitPerAccount,
          paused
        }
      }));
    }
  } as any);

  const { refetch: refetchBalance } = useContractRead({
    ...xHeXContract(chain),
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    account: address,
    chainId: chain?.id,
    onSuccess: balance => {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            balance
          }
        }
      }));
    }
  } as any);

  return (
    <XHeXContext.Provider
      value={{
        global,
        user,
        isFetching,
        setUser,
        refetchTokenState,
        refetchBalance
      }}
    >
      {children}
    </XHeXContext.Provider>
  );
};
