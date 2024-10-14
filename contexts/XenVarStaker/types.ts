import type { TAddress } from '@/contexts/types';

export type TVarStake = {
  amount: bigint;
  startPeriod: bigint;
};

export type TVarStakePeriod = {
  burns: bigint;
  yields: bigint;
  balances: bigint;
  stakesByPeriod: bigint;
  accStakesByPeriod: bigint;
  accPowerByPeriod: bigint;
  pendingWithdrawalsByPeriod: bigint;
  accPaidByPeriod: bigint;
};

export type TXenVarStaker = {
  xenYieldPct: bigint; // XEN_YIELD_PCT
  periodDurationTs: bigint; // PERIOD_DURATION_TS
  genesisTs: bigint;
  burnerCount: bigint;
  lastBurnPeriod: bigint;
  lastPeriodTs: bigint;
  currentPeriod: bigint;
  periods: Record<number, TXenVarStaker>;
};

export type TXenVarStakerUser = {
  allowance: bigint;
  stakeCounter: bigint;
  stakes: Record<number, TVarStake>;
};

export type TXenVarStakerContext = {
  global: Record<number, TXenVarStaker>;
  user: Record<number, Record<TAddress, TXenVarStakerUser>>;
  setUser: (_: any) => any;
  refetchStakerInfo: (_: any) => any;
  refetchStakerState: (_: any) => any;
  refetchStakerPeriod: (_: any) => any;
  refetchUser: (_: any) => any;
  refetchAllowance: (_: any) => any;
  isFetching: boolean;
};
