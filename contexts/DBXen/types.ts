export type TDBXen = {
  maxBPS: bigint;
  scalingFactor: bigint;
  xenBatchAmount: bigint;
  periodDuration: bigint;
  genesisTs: bigint;
  currentCycle: bigint;
  currentStartedCycle: bigint;
  lastStartedCycle: bigint;
  previousStartedCycle: bigint;
  currentCycleReward: bigint;
  lastCycleReward: bigint;
  totalNumberOfBatchesBurned: bigint;
  pendingFees: bigint;
  pendingStake: bigint;
  pendingStakeWithdrawal: bigint;
  cycleTotalBatchesBurned: bigint;
  gasPrice: bigint;
};

export type TDBXenUser = {
  balance: bigint /* DXN balance */;
  allowance: bigint /* XEN allowance */;
  allowanceDXN: bigint /* DXN allowance */;
  accCycleBatchesBurned: bigint;
  accAccruedFees: bigint;
  firstStakeCycle: bigint;
  secondStakeCycle: bigint;
  firstStakeCycleAmount: bigint;
  secondStakeCycleAmount: bigint;
  accFirstStake: bigint;
  accRewards: bigint;
  accSecondStake: bigint;
  accWithdrawableStake: bigint;
  lastActiveCycle: bigint;
  lastFeeUpdateCycle: bigint;
};

export type TDBXenContext = {
  global: Record<number, TDBXen>;
  user: Record<number, Record<string, TDBXenUser>>;
  isFetching: boolean;
  refetchUserBalance: () => any;
  refetchAllowance: () => any;
  refetchDXNAllowance: () => any;
  refetchUserState: () => any;
  refetchStakeInfo: () => any;
};
