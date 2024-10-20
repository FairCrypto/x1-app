/**
   uint256 public constant CYCLE = 1 days;
   uint256 public constant CYCLES = 100;
   uint256 public constant DURATION = CYCLES * CYCLE;

   mapping(address => uint256) public userBurnsPoints;
   mapping(address => uint256) public allocateXNTCredits;
   uint256 public totalBurnPoints;
   uint256 public totalAllocateXNTCredits;

   uint256 public amp = CYCLES;
   uint256 public genesisTs;

   mapping(address => uint256) public usedXENBurns;
   mapping(uint256 => address) public usedXENFTs;
 */

export type TMoonParty = {
  endOfParty: bigint;
  amp: bigint;
  totalBurnPoints: bigint;
  totalAllocateXNTCredits: bigint;
};

export type TMoonPartyUser = {
  usedXENBurns: bigint;
  usedXENFTs: bigint;
  userBurnsPoints: bigint;
  allocateXNTCredits: bigint;
};

export interface IMoonPartyContext {
  global: Record<number, TMoonParty>;
  user: Record<number, Record<string, TMoonPartyUser>>;
  isFetching: boolean;
  refetchUser: () => any;
  refetchGlobal: () => any;
}
