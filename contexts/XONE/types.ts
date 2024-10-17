export type TXone = {
  cap: bigint;
  startBlockNumber: bigint;
  batch: bigint;
  totalSupply: bigint;
};

export type TXoneUser = {
  balance: bigint;
  minted: bigint;
};

export type TXoneContext = {
  global: Record<number, TXone>;
  user: Record<number, Record<string, TXoneUser>>;
  isFetching: boolean;
  refetchUserBalance: () => any;
  refetchXone: () => any;
  refetchUserMints: () => any;
};
