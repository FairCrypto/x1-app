import { createContext, useState } from 'react';
import { useAccount, useContractRead, useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';

import networks from '../../config/networks';
import type { TFenixContext } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const contractABI = publicRuntimeConfig.xenCryptoABI;
const { fenixABI } = publicRuntimeConfig;

const initialValue: TFenixContext = {
  global: {},
  user: {},
  isFetching: false,
  refetchUserBalance: () => {},
  refetchAllowance: () => {}
};

export const FenixContext = createContext<TFenixContext>(initialValue);

export const FenixProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();

  const xenCryptoContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });

  const fenixContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.fenixAddress as any,
    abi: fenixABI
  });

  const { isFetching } = useContractReads({
    contracts: [
      { ...fenixContract(chain), functionName: 'genesisTs', chainId: chain?.id },
      { ...fenixContract(chain), functionName: 'cooldownUnlockTs', chainId: chain?.id },
      { ...fenixContract(chain), functionName: 'XEN_BURN_RATIO', chainId: chain?.id },
      { ...fenixContract(chain), functionName: 'rewardPoolSupply', chainId: chain?.id },
      { ...fenixContract(chain), functionName: 'shareRate', chainId: chain?.id },
      { ...fenixContract(chain), functionName: 'equityPoolSupply', chainId: chain?.id },
      { ...fenixContract(chain), functionName: 'equityPoolTotalShares', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [
        { result: genesisTs },
        { result: cooldownUnlockTs },
        { result: xenBurnRatio },
        { result: rewardPoolSupply },
        { result: shareRate },
        { result: equityPoolSupply },
        { result: equityPoolTotalShares }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          genesisTs,
          cooldownUnlockTs,
          xenBurnRatio,
          shareRate,
          rewardPoolSupply,
          equityPoolSupply,
          equityPoolTotalShares
        }
      }));
    }
  } as any);

  const { refetch: refetchUserBalance } = useContractRead({
    ...fenixContract(chain),
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

  const { refetch: refetchAllowance } = useContractRead({
    ...xenCryptoContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, fenixContract(chain)?.address],
    chainId: chain?.id,
    onSuccess: allowance => {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            allowance
          }
        }
      }));
    }
  } as any);

  return (
    <FenixContext.Provider
      value={{
        global,
        user,
        isFetching,
        refetchUserBalance,
        refetchAllowance
      }}
    >
      {children}
    </FenixContext.Provider>
  );
};
