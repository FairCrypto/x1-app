export type TFenix = {
  genesisTs: bigint;
  cooldownUnlockTs: bigint;
  xenBurnRatio: bigint;
  rewardPoolSupply: bigint;
  shareRate: bigint;
  equityPoolSupply: bigint;
  equityPoolTotalShares: bigint;
};

export type TFenixUser = {
  balance: bigint;
  allowance: bigint /* XEN */;
};

export type TFenixContext = {
  global: Record<number, TFenix>;
  user: Record<number, Record<string, TFenixUser>>;
  isFetching: boolean;
  refetchUserBalance: () => any;
  refetchAllowance: () => any;
};
