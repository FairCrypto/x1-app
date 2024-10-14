import type { TAddress } from '@/contexts/types';

export type TXEth = {
  minStakeTerm: bigint;
  stakeIdCounter: bigint;
  xenPairFee: bigint;
  totalSupply: bigint;
  lidoStakeOffset: bigint;
};

export type TStakeInfo = [bigint, bigint, bigint, bigint];

export type TXEthUser = {
  balance: bigint;
  allowance: bigint;
  userStakeIds: bigint[];
  xenStakes: Record<string, bigint>;
  stakeInfo: Record<string, TStakeInfo>;
};

export type TXEthContext = {
  global: Record<number, TXEth>;
  user: Record<number, Record<TAddress, TXEthUser>>;
  setUser: (_: any) => any;
  refetchUserStakeIds: (_?: any) => any;
  refetchUserXenStakes: (_?: any) => any;
  refetchBalance: (_?: any) => any;
  refetchAllowance: (_?: any) => any;
  isFetching: boolean;
};
