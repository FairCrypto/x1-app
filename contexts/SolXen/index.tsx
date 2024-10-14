import { AnchorProvider, Program, utils } from '@coral-xyz/anchor';
import { getMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import type { ConfirmOptions, Connection, Keypair, SignatureResultCallback } from '@solana/web3.js';
import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js';
import { createContext, useContext, useEffect, useState } from 'react';

import { SolanaContext } from '@/contexts/Solana';
import { solXenMiners } from '@/contexts/SolXen/minerJson';
import solXenMinter from '@/contexts/SolXen/sol_xen_minter.json';
import type { TSolXenMiner, TSolXenMinter } from '@/contexts/SolXen/types';

export type TTx = [number, string, string];

export type TSolXenContext = {
  computeUnits: number;
  priorityFee: number;
  minerKeys: Keypair[];
  transactions: TTx[];
  ethAddress: `0x${string}` | '';
  solXenState: Record<string, any[]>;
  ethXenState: Record<`0x${string}`, any[]>;
  solXenUserBalance: Record<string, any>;
  getSolXenState: (u: Keypair, ea: string, k: number) => any;
  getUserTokenBalance: (u: PublicKey) => any;
  setEthAddress: (s: `0x${string}`) => any;
  setMinerKeys: (keys: Keypair[]) => any;
  mineHashes: (k: Keypair, ethAddress: `0x${string}`, kind: number, o?: any, cb?: any) => any;
  mintSolXen: (k: Keypair, kind: number, o?: any, cb?: any) => any;
  setComputeUnits: (n: number) => any;
  setPriorityFee: (n: number) => any;
  checkTx: (s: string) => any;
  updateTx: (s: string, st: string) => any;
};

export type TMineOptions = {
  computeUnits: number;
  priorityFee: number;
  delay: number;
  commitment: string;
  skipPreflight: boolean;
};

export type TMintOptions = {
  priorityFee: number;
  commitment: string;
  skipPreflight: boolean;
};

const initialState: TSolXenContext = {
  computeUnits: 1_200_000,
  priorityFee: 50_000,
  minerKeys: [],
  transactions: [],
  ethAddress: null,
  solXenState: {},
  ethXenState: {},
  solXenUserBalance: {},
  setEthAddress: () => {},
  setComputeUnits: () => {},
  setPriorityFee: () => {},
  getSolXenState: () => {},
  getUserTokenBalance: () => {},
  setMinerKeys: () => {},
  mineHashes: () => {},
  mintSolXen: () => {},
  checkTx: () => {},
  updateTx: () => {}
};

export const SolXenContext = createContext<TSolXenContext>(null);

const getPDAs = (programId: PublicKey, user: string, address: string, kind: number) => {
  const [globalXnRecordAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from('xn-miner-global'), Buffer.from([kind])],
    programId
  );

  const ethAddress20 = Buffer.from(address?.slice(2), 'hex');
  const [userEthXnRecordAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('xn-by-eth'), ethAddress20, Buffer.from([kind]), programId.toBuffer()],
    programId
  );

  const [userSolXnRecordAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('xn-by-sol'),
      new PublicKey(user).toBuffer(),
      Buffer.from([kind]),
      programId.toBuffer()
    ],
    programId
  );

  return { globalXnRecordAddress, userEthXnRecordAccount, userSolXnRecordAccount };
};

const getMinterPDAs = async (
  minerProgramId: PublicKey,
  programId: PublicKey,
  user: PublicKey,
  kind: number,
  connection: Connection
) => {
  const [userSolXnRecordAccount] = minerProgramId
    ? PublicKey.findProgramAddressSync(
        [
          Buffer.from('xn-by-sol'),
          user.toBuffer(),
          Buffer.from([kind]),
          minerProgramId?.toBuffer()
        ],
        minerProgramId
      )
    : [];

  const [userTokenRecordAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('sol-xen-minted'), user.toBuffer()],
    programId
  );

  const [mint] = PublicKey.findProgramAddressSync([Buffer.from('mint')], programId);

  const mintAccount = await getMint(connection, mint);

  const userTokenAccount = utils.token.associatedAddress({
    mint: mintAccount.address,
    owner: user
  });

  return { userSolXnRecordAccount, userTokenRecordAccount, userTokenAccount, mintAccount };
};

const minersStr =
  process.env.NEXT_PUBLIC_SOL_XEN_MINERS ||
  'B8HwMYCk1o7EaJhooM4P43BHSk5M8zZHsTeJixqw7LMN,' +
    '2Ewuie2KnTvMLwGqKWvEM1S2gUStHzDUfrANdJfu45QJ,' +
    '5dxcK28nyAJdK9fSFuReRREeKnmAGVRpXPhwkZxAxFtJ,' +
    'DdVCjv7fsPPm64HnepYy5MBfh2bNfkd84Rawey9rdt5S';

const miners = minersStr
  .split(',')
  .filter(Boolean)
  .map(s => s.trim())
  .map(s => new PublicKey(s));

const minterProgramId =
  process.env.NEXT_PUBLIC_SOL_XEN_MINTER || 'EPAdVJ5S317jJr2ejgxoA52iptvphGXjPLbqXhZH4n8o';

const DEFAULT_COMPUTE_UNITS = parseInt(process.env.DEFAULT_COMPUTE_UNITS || '1200000');
const DEFAULT_PRIORITY_FEE = parseInt(process.env.DEFAULT_PRIORITY_FEE || '50000');

export const SolXenProvider = ({ children }) => {
  const { connection, setConnection } = useContext(SolanaContext);
  const { publicKey, connected } = useWallet();
  const [solXenState, setSolXenState] = useState<Record<string, any[]>>(initialState.solXenState);
  const [ethXenState, setEthXenState] = useState<Record<`0x${string}`, any[]>>(
    initialState.ethXenState
  );
  const [solXenUserBalance, setSolXenUserBalance] = useState<Record<string, any>>(
    initialState.solXenUserBalance
  );
  const [minerKeys, setKeys] = useState<Keypair[]>([]);
  const [transactions, setTransactions] = useState<TTx[]>([]);
  const [computeUnits, setComputeUnits] = useState<number>(DEFAULT_COMPUTE_UNITS);
  const [priorityFee, setPriorityFee] = useState<number>(DEFAULT_PRIORITY_FEE);
  const [ethAddress, setEthAddress] = useState<`0x${string}` | ''>('');

  const setMinerKeys = (keys: Keypair[]) => {
    if (keys.length === 0) {
      // console.log('no keys');
      /* nothing */
    }
    if (keys.length > 4) {
      // console.log('too many keys');
      /* nothing */
    }
    if (keys.length === 1) {
      setKeys(kk => [...kk, keys[0]]);
    }

    const newKeys = keys.reduce((acc, k, i) => {
      if (k) {
        acc[i] = k;
      }
      return acc;
    }, minerKeys.slice());
    setKeys(kk => newKeys);
  };

  useEffect(() => {
    if (publicKey && connected) {
      // getSolXenBalance(publicKey).then(console.log);
    }
  }, [ethAddress, publicKey, connected]);

  const getSolXenState = async (userAccount: Keypair, ethAddress: string, kind: number) => {
    const idl = solXenMiners[kind] as unknown as TSolXenMiner;
    const provider = new AnchorProvider(connection, null, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);
    const { globalXnRecordAddress, userEthXnRecordAccount, userSolXnRecordAccount } = getPDAs(
      miners[kind],
      userAccount.publicKey.toBase58(),
      ethAddress,
      kind
    );
    try {
      const globalXnRecord = await program.account.globalXnRecord.fetch(globalXnRecordAddress);
      const userEthXnRecord = await program.account.userEthXnRecord.fetch(userEthXnRecordAccount);
      const userSolXnRecord = await program.account.userSolXnRecord.fetch(userSolXnRecordAccount);

      setSolXenState(s => ({ ...s, [kind]: [globalXnRecord, userEthXnRecord, userSolXnRecord] }));

      return { globalXnRecord, userEthXnRecord, userSolXnRecord };
    } catch (e) {
      return { globalXnRecord: null, userEthXnRecord: null, userSolXnRecord: null };
    }
  };

  const getUserTokenBalance = async (userAccount: PublicKey) => {
    const idl = solXenMinter as unknown as TSolXenMinter;
    const provider = new AnchorProvider(connection, null, {});

    // Generate the program client from IDL.
    try {
      const program = new Program(idl, provider);
      const { userTokenRecordAccount } = await getMinterPDAs(
        null,
        new PublicKey(minterProgramId),
        userAccount,
        -1,
        connection
      );
      const userTokensRecord = await program.account.userTokensRecord.fetch(userTokenRecordAccount);

      setSolXenUserBalance(userTokensRecord);

      return { userTokensRecord };
    } catch (e) {
      return { userTokensRecord: null };
    }
  };

  const mineHashes = async (
    userAccount: Keypair,
    ethAddress: `0x${string}`,
    kind: number,
    options?: TMineOptions,
    callback?: (h: string) => SignatureResultCallback
  ) => {
    const idl = solXenMiners[kind] as unknown as TSolXenMiner;
    const provider = new AnchorProvider(connection, null, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const { globalXnRecordAddress, userEthXnRecordAccount, userSolXnRecordAccount } = getPDAs(
      miners[kind],
      userAccount.publicKey.toBase58(),
      ethAddress,
      kind
    );
    const mintAccounts = {
      user: userAccount.publicKey,
      xnByEth: userEthXnRecordAccount,
      xnBySol: userSolXnRecordAccount,
      globalXnRecord: globalXnRecordAddress,
      programId: miners[kind]
    };
    const ethAddress20 = Buffer.from(ethAddress.slice(2), 'hex');
    const ethAddr = { address: Array.from(ethAddress20), addressStr: ethAddress };

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: options?.computeUnits || computeUnits || DEFAULT_COMPUTE_UNITS
    });
    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: options?.priorityFee || priorityFee || DEFAULT_PRIORITY_FEE
    });

    const anchorOptions = {
      // ...AnchorProvider.defaultOptions(),
      skipPreflight: true,
      commitment: 'processed',
      preflightCommitment: 'processed',
      maxRetries: 10
      // minContextSlot: 0
    } as ConfirmOptions;

    const mineHashesInstruction = await program.methods
      .mineHashes(ethAddr, kind)
      .accounts(mintAccounts)
      .instruction();

    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: userAccount.publicKey,
      recentBlockhash: recentBlockhash.blockhash
    })
      .add(modifyComputeUnits)
      .add(addPriorityFee)
      .add(mineHashesInstruction);
    transaction.partialSign(userAccount);

    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      ...options,
      preflightCommitment: 'processed',
      maxRetries: 10
    });

    setTransactions(txs => {
      if (!txs.find(tx => tx[0] === kind && tx[1] === signature)) {
        return [[kind, signature, 'sent'], ...txs.slice(0, 99)];
      }
      return txs;
    });

    connection.onSignature(signature, callback(signature), 'confirmed');

    return signature;
  };

  const mintSolXen = async (
    userAccount: Keypair,
    kind: number,
    options?: TMintOptions,
    callback?: (h: string) => SignatureResultCallback
  ) => {
    const anchorOptions = {
      // ...AnchorProvider.defaultOptions(),
      skipPreflight: options.skipPreflight || false,
      commitment: options.commitment || 'processed',
      preflightCommitment: 'processed',
      maxRetries: 10
      // minContextSlot: 0
    } as ConfirmOptions;

    const idl = solXenMinter as TSolXenMinter;
    const provider = new AnchorProvider(connection, null, anchorOptions);

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const { userSolXnRecordAccount, userTokenRecordAccount, userTokenAccount, mintAccount } =
      await getMinterPDAs(
        miners[kind],
        new PublicKey(minterProgramId),
        userAccount.publicKey,
        kind,
        connection
      );

    const associateTokenProgram = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

    const mintAccounts = {
      user: userAccount.publicKey,
      mintAccount: mintAccount.address,
      userTokenAccount,
      userRecord: userSolXnRecordAccount,
      userTokenRecord: userTokenRecordAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associateTokenProgram,
      minerProgram: new PublicKey(miners[kind])
    };

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: options?.priorityFee || priorityFee || DEFAULT_PRIORITY_FEE
    });

    const mintSolXenInstruction = await program.methods
      .mintTokens(kind)
      .accounts(mintAccounts)
      .instruction();

    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: userAccount.publicKey,
      recentBlockhash: recentBlockhash.blockhash
    })
      .add(addPriorityFee)
      .add(mintSolXenInstruction);
    transaction.partialSign(userAccount);

    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      ...options,
      preflightCommitment: 'processed',
      maxRetries: 10
    });

    connection.onSignature(signature, callback(signature), 'confirmed');

    setTransactions(txs => {
      if (!txs.find(tx => tx[1] === signature)) {
        return [[-1, signature, 'sent'], ...txs.slice(0, 99)];
      }
      return txs;
    });

    return signature;
  };

  const updateTx = (signature: string, status: string) => {
    setTransactions(txs => {
      const idx = txs.findIndex(tx => tx[1] === signature);
      if (idx >= 0) {
        const tx = txs[idx];
        return [...txs.slice(0, idx), [tx[0], signature, status], ...txs.slice(idx + 1)];
      }
      return txs;
    });
  };

  const checkTx = async (signature: string) => {
    const tx = await connection.getTransaction(signature);
    if (tx) {
      updateTx(signature, 'confirmed');
    }
  };

  return (
    <SolXenContext.Provider
      value={{
        computeUnits,
        priorityFee,
        minerKeys,
        transactions,
        ethAddress,
        solXenState,
        ethXenState,
        solXenUserBalance,
        getSolXenState,
        getUserTokenBalance,
        setEthAddress,
        setMinerKeys,
        mineHashes,
        mintSolXen,
        setComputeUnits,
        setPriorityFee,
        checkTx,
        updateTx
      }}
    >
      {children}
    </SolXenContext.Provider>
  );
};
