export type TXenBurn = {
  tokenIdCounter: bigint;
  defaultPoolFee: bigint;
  minValue: bigint;
};

export type TXenBurnUser = {
  balance: bigint;
  allowance: bigint;
  ownedTokens: bigint[];
  tokens: Record<number, any>;
};

export type TXenBurnContext = {
  global: Record<number, TXenBurn>;
  user: Record<number, Record<string, TXenBurnUser>>;
  setUser: (_: any) => any;
  isFetching: boolean;
  refetchOwnedTokens: any;
  refetchAllowance: any;
  fetchNextPage: any;
};
