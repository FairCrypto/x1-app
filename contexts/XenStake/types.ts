export type TXenStake = {
  genesisTs: bigint;
  tokenIdCounter: bigint;
};

export type TXenStakeUser = {
  balance: bigint;
  allowance: bigint;
  ownedTokens: bigint[];
  tokens: Record<number, any>;
};

export type TXenStakeContext = {
  global: Record<number, TXenStake>;
  user: Record<number, Record<string, TXenStakeUser>>;
  setUser: (_: any) => any;
  isFetching: boolean;
  refetchOwnedTokens: any;
  refetchAllowance: any;
  fetchNextPage: any;
};
