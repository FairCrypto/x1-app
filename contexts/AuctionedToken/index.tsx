import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import { useTokenInfo } from '@/contexts/AuctionedToken/useTokenInfo';
import type { TAddress } from '@/contexts/types';
import { XenTokenizerContext } from '@/contexts/XenTokenizer';

import networks from '../../config/networks';
import type { TAuctionedTokenContext } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { xenCryptoABI: contractABI, tokenizerABI, auctionedTokenABI } = publicRuntimeConfig;

const initialValue: TAuctionedTokenContext = {
  global: {},
  user: {},
  isFetching: false,
  setCurrentToken: () => {},
  refetchTokenInfo: () => {},
  refetchTokenUser: () => {}
};

export const AuctionedTokenContext = createContext<TAuctionedTokenContext>(initialValue);

export const AuctionedTokenProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const [currentToken, setCurrentToken] = useState();
  const { address, chain } = useAccount();
  const { global: globalTokenizer } = useContext(XenTokenizerContext);

  const { refetchTokenInfo, isFetching: tokenInfoIsFetching } = useTokenInfo(
    chain,
    globalTokenizer?.[chain?.id]?.tokens?.[currentToken || '']?.address,
    address,
    setGlobal,
    setUser
  );

  const xenContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: contractABI
  });
  const xenTokenizerContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.tokenizerAddress as any,
    abi: tokenizerABI
  });
  const auctionedTokenContract = (chain: any, address: TAddress) => ({
    address,
    abi: auctionedTokenABI
  });

  const varStakerAddress = Object.values(supportedNetworks).find(
    n => Number(n?.chainId) === chain?.id
  )?.varStakerAddress;

  const currentTokenAddress = globalTokenizer?.[chain?.id]?.tokens?.[currentToken || '']?.address;

  useEffect(() => {
    // setCurrentToken(null);
  }, [chain?.id, address]);

  const { isFetching: isFetchingAllowance, refetch: refetchAllowance } = useContractReads({
    contracts: [
      {
        ...xenContract(chain),
        functionName: 'allowance',
        chainId: chain?.id,
        args: [address, varStakerAddress]
      },
      { ...xenContract(chain), functionName: 'balanceOf', chainId: chain?.id, args: [address] }
    ],
    onSuccess: init => {
      const [{ result: allowance }, { result: balanceOf }] = init;
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [currentTokenAddress]: {
            ...(g?.[chain?.id]?.[currentTokenAddress] || {}),
            [address]: {
              ...(g?.[chain?.id]?.[currentTokenAddress]?.[address] || {}),
              allowance,
              xenBalance: balanceOf
            }
          }
        }
      }));
    }
  });

  useEffect(() => {
    if (currentToken) {
      refetchTokenInfo().then(_ => {
        refetchAllowance().then(_ => {});
      });
    }
  }, [currentToken, address]);

  const refetchTokenUser = () => refetchAllowance().then(_ => {});

  return (
    <AuctionedTokenContext.Provider
      value={{
        global,
        user,
        isFetching: tokenInfoIsFetching || isFetchingAllowance,
        setCurrentToken,
        refetchTokenInfo,
        refetchTokenUser
      }}
    >
      {children}
    </AuctionedTokenContext.Provider>
  );
};
