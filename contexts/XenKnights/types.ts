export type TXenKnights = {
  startTs: bigint;
  endTs: bigint;
  status: KnightStatus;
  owner: bigint;
  MAX_WINNERS: bigint;
  totalPlayers: bigint;
  totalToBurn: bigint;
  leaderboard: bigint[];
  leaders: Record<string, any>;
  bids: Record<string, any>;
};

export type TXenKnightsUser = {
  isOwner: boolean;
  allowance: bigint;
};

export type TXenKnightsContext = {
  global: Record<number, TXenKnights>;
  user: Record<number, Record<string, TXenKnightsUser>>;
  isFetching: boolean;
  refetchAllowance: () => any;
  getXenKnightBidsAndLeaders: () => any;
  getXenKnightsLeader: (taprootAddress: string | null) => any;
  getXenKnightsLosers: () => any;
  getKnightsBidAmount: (addr: string) => any;
  loadXenKnightsBids: () => any;
  setUser: (_: TXenKnightsUser) => any;
};

export enum KnightStatus {
  Waiting,
  InProgress,
  Final, // leaderboard loaded
  Ended, // XEN burned for leaders
  Canceled // in case shit happens
}
