export type TXenTicker = {
  xenBurnFloor: bigint;
  xenBurnStep: bigint;
  counterSteps: bigint;
  tickerLength: bigint;
  xenBurnedByTicker: Record<number, bigint>;
  xenTickers: Record<string, number>;
  xenBurnRequired: bigint;
  tokenIdCounter: bigint;
};

export type TXenTickerUser = {
  balance: bigint;
  allowance: bigint;
  ownedTokens: bigint[];
  tokens: Record<number, any>;
};

export type TXenTickerContext = {
  global: Record<number, TXenTicker>;
  user: Record<number, Record<string, TXenTickerUser>>;
  setUser: (_: any) => any;
  isFetching: boolean;
  refetchOwnedTokens: any;
  refetchAllowance: any;
  fetchNextPage: any;
};
