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

export type TXenTokenizer = {
  tokenCount: bigint;
  allTokens: string[];
  tokens: Record<string, TTokenInfo>;
};

export type TXenTokenizerUser = {
  ownedTokens: Record<string, TAddress>;
  bids: Record<string, bigint>;
  tokenBalances: Record<string, bigint>; // TODO: move to individual tokens?
};

export type TXenTokenizerContext = {
  global: Record<number, TXenTokenizer>;
  user: Record<number, Record<string, TXenTokenizerUser>>;
  setUser: (_: any) => any;
  isFetching: boolean;
  refetchTokenCount: any;
  refetchAllTokens: any;
  refetchTokenBalances: any;
};
