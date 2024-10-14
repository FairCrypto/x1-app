import type { TAddress } from '@/contexts/types';

export type TXHeX = {
  // cap: bigint;
  totalSupply: bigint;
  // startBlockNumber: bigint;
  // durationBlocks: bigint;
  // limitPerAccount: bigint;
  paused: boolean;
};

export type TXHeXUser = {
  balance: bigint;
};

export type TXHeXContext = {
  global: Record<number, TXHeX>;
  user: Record<number, Record<TAddress, TXHeXUser>>;
  setUser: (_: any) => any;
  refetchTokenState: (_?: any) => any;
  refetchBalance: (_?: any) => any;
  isFetching: boolean;
};
