export type TMintInfo = {
  user: string;
  term: bigint;
  maturityTs: bigint;
  rank: bigint;
  amplifier: bigint;
  eaaRate: bigint;
};

export type TStakeInfo = {
  user: string;
  amount: bigint;
  term: bigint;
  maturityTs: bigint;
  apy: bigint;
};

export type TXenCrypto = {
  genesisTs: bigint;
  currentMaxTerm: bigint;
  currentAMP: bigint;
  currentEAA: bigint;
  currentAPY: bigint;
  globalRank: bigint;
  totalSupply: bigint;
  activeMinters: bigint;
  activeStakes: bigint;
  totalXenStaked: bigint;
};

export type TXenCryptoUser = {
  balance: bigint;
  mintInfo: TMintInfo;
  stakeInfo: TStakeInfo;
  userBurns: bigint;
};

export type TXenCryptoContext = {
  global: Record<number, TXenCrypto>;
  user: Record<number, Record<string, TXenCryptoUser>>;
  isFetching: boolean;
  refetchUserBalance: () => any;
  refetchUserMint: () => any;
  refetchUserStake: () => any;
  refetchUserBurns: () => any;
};
