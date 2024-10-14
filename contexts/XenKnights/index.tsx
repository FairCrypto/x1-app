import { readContract } from '@wagmi/core';
import debug from 'debug';
import { createContext, useState } from 'react';
import { keccak256 } from 'viem';
import { useAccount, useConfig, useContractRead, useContractReads } from 'wagmi';

import { publicRuntimeConfig } from '@/config/runtimeConfig';

import networks from '../../config/networks';
import type { TXenKnightsContext, TXenKnightsUser } from './types';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { xenCryptoABI } = publicRuntimeConfig;
const xenKnightsABI = publicRuntimeConfig.knightsABI;

// const log = debug('context:knights');
const error = debug('context:knights:error');

const etherInWei = BigInt('1000000000000000000');

const initialValue: TXenKnightsContext = {
  global: {},
  user: {},
  isFetching: false,
  refetchAllowance: () => {},
  getXenKnightBidsAndLeaders: () => {},
  getXenKnightsLeader: (_: string | null) => {},
  getXenKnightsLosers: () => {},
  getKnightsBidAmount: (_: string) => {},
  loadXenKnightsBids: () => {},
  setUser: (_: TXenKnightsUser) => {}
};

export const XenKnightsContext = createContext<TXenKnightsContext>(initialValue);

export const XenKnightsProvider = ({ children }) => {
  const [global, setGlobal] = useState({});
  const [user, setUser] = useState({});
  const { address, chain } = useAccount();
  const config = useConfig();

  const xenContract = (chain: any) => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.contractAddress as any,
    abi: xenCryptoABI
  });

  const xenKnightsContract = chain => ({
    address: Object.values(supportedNetworks).find(n => Number(n?.chainId) === chain?.id)
      ?.knightsAddress as any,
    abi: xenKnightsABI
  });

  const { isFetching } = useContractReads({
    contracts: [
      { ...xenKnightsContract(chain), functionName: 'startTs', chainId: chain?.id },
      { ...xenKnightsContract(chain), functionName: 'endTs', chainId: chain?.id },
      { ...xenKnightsContract(chain), functionName: 'status', chainId: chain?.id },
      { ...xenKnightsContract(chain), functionName: 'owner', chainId: chain?.id },
      { ...xenKnightsContract(chain), functionName: 'MAX_WINNERS', chainId: chain?.id },
      { ...xenKnightsContract(chain), functionName: 'totalPlayers', chainId: chain?.id },
      { ...xenKnightsContract(chain), functionName: 'totalToBurn', chainId: chain?.id }
      // { ...xenKnightsContract(chain), functionName: 'leaderboard', chainId: chain?.id },
    ],
    onSuccess: init => {
      const [
        { result: startTs },
        { result: endTs },
        { result: status },
        { result: owner },
        { result: MAX_WINNERS },
        { result: totalPlayers },
        { result: totalToBurn }
        // { result: leaderboard },
      ] = init;
      setGlobal(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          startTs,
          endTs,
          status,
          owner,
          MAX_WINNERS,
          totalPlayers,
          totalToBurn
          // leaderboard
        }
      }));
    }
  } as any);

  const { refetch: refetchAllowance } = useContractRead({
    ...xenContract(chain),
    functionName: 'allowance',
    account: address,
    args: [address, xenKnightsContract(chain)?.address],
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

  /*
  N.B. Moved to useBidAmounts.ts

  const { refetch } = useContractRead({
    ...xenKnightsContract(chain),
    functionName: 'amounts',
    account: address,
    chainId: chain?.id,
    args: [keccak256(taprootAddress)],
    onSuccess: (amounts) => {
      setUser(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          [address as `0x${string}`]: {
            ...g?.[chain?.id as number]?.[address as `0x${string}`],
            amounts,
          }
        }
      }))
    }
  })
   */

  // 05438910b3130f4c7decc9451f42d353d40890a8c5344ac9ee7d86ac367f205ci0

  const aggregateBids = (bids: any[]) =>
    bids.reduce((res, b) => {
      if (b.taprootAddress in res) {
        res[b.taprootAddress].push(b.user);
      } else {
        res[b.taprootAddress] = [b.user];
      }
      return res;
    }, {});

  const getXenKnightBidsAndLeaders = async () => {
    try {
      const getBidsSortedUrl = publicRuntimeConfig.xenApiUrl;
      const knightsAddress = xenKnightsContract(chain).address;
      const currentNetwork = Object.values(supportedNetworks).find(
        n => Number(n?.chainId) === Number(chain?.id)
      )?.networkId;
      const leaders = await fetch(
        `${getBidsSortedUrl}/XenKnights/leaders?network=${currentNetwork}&contractAddress=${knightsAddress}`
      ).then(r => r.json());
      const bids = await fetch(
        `${getBidsSortedUrl}/XenKnights/bids?network=${currentNetwork}&contractAddress=${knightsAddress}&limit=4999`
      ).then(r => r.json());
      const filteredBids = bids.filter(
        ({ contractAddress }) => contractAddress.toLowerCase() === knightsAddress?.toLowerCase()
      );
      return { leaders: [...leaders].reverse(), bids: aggregateBids(filteredBids) };
    } catch (e) {
      error('XEN API', e);
      return { leaders: [], bids: {} };
    }
  };

  const getXenKnightsLeader = async (taprootAddress: string | null) => {
    try {
      const getBidsSortedUrl = publicRuntimeConfig.xenApiUrl;
      const contractAddress = xenKnightsContract(chain).address;
      const n = Object.values(supportedNetworks).find(
        n => Number(n?.chainId) === Number(chain?.id)
      )?.networkId;
      const url = `${getBidsSortedUrl}/XenKnights/leaders?network=${n}&contractAddress=${contractAddress}`;
      const reqUrl = taprootAddress
        ? `${url}&taprootAddress=${taprootAddress}`
        : `${url}&user=${address}`;
      const leaders = await fetch(reqUrl).then(r => r.json());
      return leaders;
    } catch (e) {
      error('XEN API', e);
      return null;
    }
  };

  const getXenKnightsLosers = async () => {
    try {
      const n = Object.values(supportedNetworks).find(
        n => Number(n?.chainId) === Number(chain?.id)
      )?.networkId;
      const contractAddress = xenKnightsContract(chain).address;
      const getBidsSortedUrl = publicRuntimeConfig.xenApiUrl;
      const reqUrl = `${getBidsSortedUrl}/XenKnights/leaders?network=${n}&contractAddress=${contractAddress}&order=desc&limit=4999`;
      const losers = await fetch(reqUrl).then(r => r.json());
      return losers;
    } catch (e) {
      error('XEN API', e);
      return [];
    }
  };

  const getKnightsBidAmount = async (addr: string) =>
    readContract(config, {
      ...xenKnightsContract(chain).address,
      functionName: 'amounts',
      args: [keccak256(addr as `0x${string}`)],
      account: address
    }).then(b => Number((b as any) / etherInWei));

  const loadXenKnightsBids = async () => {
    try {
      const { bids, leaders: allLeaders } = await getXenKnightBidsAndLeaders();
      const leaders = allLeaders.map(leader => ({
        ...leader,
        amount: BigInt(leader.amount.toString())
      }));
      setGlobal(g => ({
        ...g,
        [chain?.id as number]: {
          ...g?.[chain?.id as number],
          leaders,
          leaderboard: allLeaders,
          bids
        }
      }));
    } catch (e) {
      error('loadXenKnightsBids', e);
    }
  };

  return (
    <XenKnightsContext.Provider
      value={{
        global,
        user,
        isFetching,
        refetchAllowance,
        getXenKnightBidsAndLeaders,
        getXenKnightsLeader,
        getXenKnightsLosers,
        getKnightsBidAmount,
        loadXenKnightsBids,
        setUser
      }}
    >
      {children}
    </XenKnightsContext.Provider>
  );
};
