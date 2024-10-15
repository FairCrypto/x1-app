export type TXenTorrent = {
  genesisTs: bigint;
  startBlockNumber: bigint;
  powerGroupSize: bigint;
  specialCategoriesVMUThreshold: bigint;
  specialClassesBurnRates: bigint[];
  specialClassesTokenLimits: number[];
  specialClassesCounters: number[];
  tokenIdCounter: bigint;
};

export type TXenTorrentUser = {
  balance: bigint;
  allowance: bigint;
  ownedTokens: bigint[];
  tokens: Record<number, any>;
  mintedTokens: bigint[];
};

export type TXenTorrentContext = {
  global: Record<number, TXenTorrent>;
  user: Record<number, Record<string, TXenTorrentUser>>;
  setUser: (_: any) => any;
  isFetching: boolean;
  refetchOwnedTokens: any;
  refetchAllowance: any;
  fetchNextPage: any;
  fetchNextPageMintedTokenData: any;
};
