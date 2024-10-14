import { useEffect, useState } from 'react';
import type { Chain } from 'wagmi';
import { useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import type { TAddress } from '@/contexts/types';

const { auctionedTokenABI } = publicRuntimeConfig;

const auctionedTokenContract = (chain: any, address: TAddress) => ({
  address,
  abi: auctionedTokenABI
});

/*
    uint256 public immutable batchSize;
    uint256 public immutable cycleInterval;
    uint256 public immutable startBlockNumber;
    address public immutable factory;

    uint256 public currentCycle = 1;
    mapping(uint256 => mapping(address => uint256)) public bids;
    mapping(uint256 => uint256) public totals;
    mapping(address => uint256) public lastProcessedCycles;
    mapping(address => uint256) public userBurns;
 */

export const useTokenInfo = (
  chain: Chain,
  address: TAddress,
  user: TAddress,
  setGlobal: any,
  setUser: any
) => {
  const [currentCycle, setCurrentCycle] = useState<bigint>(0n);

  const { isFetching: isFetchingInit, refetch } = useContractReads({
    contracts: [
      { ...auctionedTokenContract(chain, address), functionName: 'symbol', chainId: chain?.id },
      { ...auctionedTokenContract(chain, address), functionName: 'cap', chainId: chain?.id },
      { ...auctionedTokenContract(chain, address), functionName: 'batchSize', chainId: chain?.id },
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'cycleInterval',
        chainId: chain?.id
      },
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'startBlockNumber',
        chainId: chain?.id
      }
    ],
    onSuccess: init => {
      const [
        { result: symbol },
        { result: cap },
        { result: batchSize },
        { result: cycleInterval },
        { result: startBlockNumber }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...(g?.[chain?.id]?.[address] || {}),
            symbol,
            cap,
            batchSize,
            cycleInterval,
            startBlockNumber
          }
        }
      }));
    }
  });

  useEffect(() => {
    if (chain && address && user) {
      refetch().then(_ => {});
    }
  }, [chain, address, user]);

  const { isFetching: isFetchingTokenInfo, refetch: refetchTokenInfo } = useContractReads({
    contracts: [
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'currentCycle',
        chainId: chain?.id
      },
      { ...auctionedTokenContract(chain, address), functionName: 'totalSupply', chainId: chain?.id }
    ],
    onSuccess: init => {
      const [{ result: currentCycle }, { result: totalSupply }] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...(g?.[chain?.id]?.[address] || {}),
            totalSupply,
            currentCycle
          }
        }
      }));
      setCurrentCycle(currentCycle as any);
    }
  });

  const { isFetching: isFetchingCycleInfo, refetch: refetchCycleInfo } = useContractReads({
    contracts: [
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'totals',
        chainId: chain?.id,
        args: [currentCycle]
      },
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'bids',
        chainId: chain?.id,
        args: [currentCycle, user]
      },
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'lastProcessedCycles',
        chainId: chain?.id,
        args: [user]
      },
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'userBurns',
        chainId: chain?.id,
        args: [user]
      },
      {
        ...auctionedTokenContract(chain, address),
        functionName: 'balanceOf',
        chainId: chain?.id,
        args: [user]
      }
    ],
    onSuccess: init => {
      const [
        { result: totals },
        { result: bids },
        { result: lastProcessedCycles },
        { result: userBurns },
        { result: balanceOf }
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...(g?.[chain?.id]?.[address] || {}),
            totals: {
              ...(g?.[chain?.id]?.[address]?.totals || {}),
              [Number(currentCycle)]: totals
            }
            // bids
          }
        }
      }));
      setUser(g => ({
        ...g,
        [chain?.id]: {
          ...g?.[chain?.id],
          [address]: {
            ...(g?.[chain?.id]?.[address] || {}),
            [user]: {
              ...(g?.[chain?.id]?.[address]?.[user] || {}),
              bids,
              lastProcessedCycles,
              userBurns,
              balance: balanceOf
            }
          }
        }
      }));
    }
  });

  useEffect(() => {
    if (chain && address && user) {
      refetchCycleInfo().then(_ => {});
    }
  }, [currentCycle, chain, address, user]);

  return {
    isFetching: isFetchingInit || isFetchingTokenInfo,
    refetchTokenInfo
  };
};
