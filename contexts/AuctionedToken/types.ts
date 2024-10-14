import type { TAddress } from '@/contexts/types';

export type TTokenInfo = {
  symbol: string;
  name: string;
  address: TAddress;
  deployer: TAddress;
  burns: bigint;
  totalSupply: bigint;
  cap: bigint;
};

export type TAuctionedToken = TTokenInfo & {
  currentCycle: bigint;
  totals: Record<number, bigint>;
};

export type TAuctionedTokenUser = {
  xenBalance: bigint;
  balance: bigint;
  allowance: bigint;
  bids: Record<number, bigint>;
  lastProcessedCycles: bigint;
  userBurns: bigint;
};

export type TAuctionedTokenContext = {
  global: Record<number, Record<TAddress, TAuctionedToken>>;
  user: Record<number, Record<TAddress, Record<TAddress, TAuctionedTokenUser>>>;
  isFetching: boolean;
  setCurrentToken: any;
  refetchTokenInfo: any;
  refetchTokenUser: any;
};
