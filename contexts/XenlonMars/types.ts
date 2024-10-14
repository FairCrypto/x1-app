export type TLeaderInfo = {
  minted: bigint;
  user: string;
};

export type TXenlonMars = {
  genesisTs: bigint;
  burnTimestamps: bigint[];
  totalBurns: bigint;
  xlonPerDXN: bigint;
  leaders: TLeaderInfo[];
};

export type TXenlonMarsUser = {
  balance: bigint;
  allowance: bigint /* DXN */;
  burnsByUser: bigint;
};

export type TXenlonMarsContext = {
  global: Record<number, TXenlonMars>;
  user: Record<number, Record<string, TXenlonMarsUser>>;
  isFetching: boolean;
  refetchUserBalance: () => any;
  refetchAllowance: () => any;
  fetchNextPage: () => any;
  getXenlonMarsLeaders: (_: string, __: number) => any;
  getXenlonMarsBurns: (_: number) => any;
};
