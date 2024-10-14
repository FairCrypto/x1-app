import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
// import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { ConfirmOptions, Connection, Keypair, SignatureResultCallback } from '@solana/web3.js';
import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js';
import { createContext, useContext, useState } from 'react';

import { X1Context } from '@/contexts/X1';

import x1Game from './x_1_game.json';
import type { X1Game } from './x1_game';

export type TTx = [number, string, string];

export type TX1GameContext = {
  priorityFee: number;
  transactions: TTx[];
  // x1GameState: any;
  // x1RoundState: any;
  // x1UserRoundState: any;
  // x1UserState: any;
  getX1GameState: (u: Keypair, r: number) => any;
  getUserTokenBalance: (u: Keypair, r: number) => any;
  click: (k: Keypair, round: number, o?: any, cb?: any) => any;
  mint: (k: Keypair, round: number, o?: any, cb?: any) => any;
  setPriorityFee: (n: number) => any;
  checkTx: (s: string) => any;
  updateTx: (s: string, st: string) => any;
};

export type TClickOptions = {
  priorityFee: number;
  commitment: string;
  skipPreflight: boolean;
};

export type TMintOptions = {
  priorityFee: number;
  commitment: string;
  skipPreflight: boolean;
};

const initialState: TX1GameContext = {
  priorityFee: 1,
  transactions: [],
  // x1GameState: null,
  // x1RoundState: null,
  // x1UserRoundState: null,
  // x1UserState: null,
  getX1GameState: () => {},
  getUserTokenBalance: () => {},
  setPriorityFee: () => {},
  click: () => {},
  mint: () => {},
  checkTx: () => {},
  updateTx: () => {}
};

export const X1GameContext = createContext<TX1GameContext>(initialState);

function toLittleEndian64Bit(n: number) {
  const buffer = new ArrayBuffer(8); // Create an 8-byte buffer
  const view = new DataView(buffer);

  // JavaScript only supports 53-bit integers natively, so handle the number appropriately
  const high = Math.floor(n / 2 ** 32); // Get the high 32 bits
  const low = n % 2 ** 32; // Get the low 32 bits

  view.setUint32(0, low, true); // Write low 32 bits, little-endian
  view.setUint32(4, high, true); // Write high 32 bits, little-endian

  // console.log(new Uint8Array(buffer))
  return new Uint8Array(buffer); // Return as a Uint8Array
  // return buffer; // Return as a Uint8Array
}

const getPDAs = async (
  programId: PublicKey,
  user: Keypair,
  round: number,
  connection: Connection
) => {
  const [x1GameStateAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('x1-game')],
    programId
  );

  const [x1GameRoundAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('x1-game-round'), toLittleEndian64Bit(round)],
    programId
  );

  const [x1GameUserRoundAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('x1-user-round'), toLittleEndian64Bit(round), user.publicKey.toBuffer()],
    programId
  );

  const [x1GameUserAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('x1-game-user'), user.publicKey.toBuffer()],
    programId
  );

  // const [mint] = PublicKey.findProgramAddressSync([Buffer.from('x1-game-mint')], programId);

  // const mintAccount = await getMint(connection, mint);

  // const userTokenAccount = utils.token.associatedAddress({
  //   mint: mintAccount.address,
  //   owner: user.publicKey
  // });

  return {
    x1GameStateAccount,
    x1GameRoundAccount,
    x1GameUserRoundAccount,
    x1GameUserAccount,
    mintAccount: null,
    userTokenAccount: null
  };
};

const gameProgramId =
  process.env.NEXT_PUBLIC_X1_GAME_PROGRAM_ID || '8yeFvD9rxGdhBcwCKgtzQwjgZVa7EJW3aK6uxoGB6Kj7';

const SLOTS_PER_ROUND = 256;
const DEFAULT_PRIORITY_FEE = parseInt(process.env.DEFAULT_PRIORITY_FEE || '50000');

export const X1GameProvider = ({ children }) => {
  const { connection } = useContext(X1Context);

  const [transactions, setTransactions] = useState<TTx[]>([]);
  const [priorityFee, setPriorityFee] = useState<number>(DEFAULT_PRIORITY_FEE);

  const getX1GameState = async (userAccount: Keypair, round: number) => {
    const idl = x1Game as X1Game;
    const provider = new AnchorProvider(connection, null, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);
    const { x1GameStateAccount, x1GameRoundAccount, x1GameUserRoundAccount, x1GameUserAccount } =
      await getPDAs(program.programId, userAccount, round, connection);

    let x1GameState = null;
    let x1RoundState = null;
    let x1UserRoundState = null;
    let x1UserState = null;
    let slot = null;
    let expectedRound = null;

    try {
      x1GameState = await program.account.x1GameState.fetch(x1GameStateAccount);
    } catch (_) {
      // nothing
    }
    try {
      slot = await connection.getSlot();
      const roundInc = Math.floor(
        ((slot || 0) - (x1GameState?.lastRoundSlot?.toNumber() || 0)) / SLOTS_PER_ROUND
      );
      expectedRound = (x1GameState?.currentRound?.toNumber() || 0) + roundInc;
    } catch (_) {
      // nothing
    }
    try {
      x1RoundState = await program.account.x1RoundState.fetch(x1GameRoundAccount);
    } catch (_) {
      // nothing
    }
    try {
      x1UserRoundState = await program.account.x1UserRoundState.fetch(x1GameUserRoundAccount);
    } catch (_) {
      // nothing
    }
    try {
      x1UserState = await program.account.x1UserState.fetch(x1GameUserAccount);
    } catch (_) {
      // nothing
    }
    return { x1GameState, x1RoundState, x1UserRoundState, x1UserState, expectedRound, slot };
  };

  const getUserTokenBalance = async (userAccount: Keypair, round: number) => {
    const idl = x1Game as X1Game;
    const provider = new AnchorProvider(connection, null, {});

    // Generate the program client from IDL.
    try {
      const program = new Program(idl, provider);
      const { mintAccount, userTokenAccount, x1GameUserAccount } = await getPDAs(
        program.programId,
        userAccount,
        round,
        connection
      );
      const totalSupply = await connection.getTokenSupply(mintAccount.address);
      const userTokensRecord = await program.account.x1UserState.fetch(x1GameUserAccount);

      return { x1GameUserAccount, totalSupply };
    } catch (e) {
      return { x1GameUserAccount: null, totalSupply: 0 };
    }
  };

  const click = async (
    userAccount: Keypair,
    round: number,
    options?: TClickOptions,
    callback?: (h: string) => SignatureResultCallback
  ) => {
    const idl = x1Game as X1Game;
    const wallet = null; // {} as Wallet;
    const provider = new AnchorProvider(connection, wallet, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFee
    });

    const { x1GameStateAccount, x1GameRoundAccount, x1GameUserRoundAccount, x1GameUserAccount } =
      await getPDAs(program.programId, userAccount, round, connection);

    const anchorOptions = {
      // ...AnchorProvider.defaultOptions(),
      skipPreflight: true,
      commitment: 'processed',
      preflightCommitment: 'processed',
      maxRetries: 10
      // minContextSlot: 0
    } as ConfirmOptions;

    const clickAccounts = {
      x1GameState: x1GameStateAccount,
      x1RoundState: x1GameRoundAccount,
      x1UserRoundState: x1GameUserRoundAccount,
      x1UserState: x1GameUserAccount,
      user: userAccount.publicKey,
      programId: program.programId
    };

    try {
      const clickInstruction = await program.methods
        .click(new BN(round))
        .accounts(clickAccounts)
        .signers([userAccount])
        .preInstructions([addPriorityFee])
        .instruction();

      const recentBlockhash = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: userAccount.publicKey,
        recentBlockhash: recentBlockhash.blockhash
      })
        .add(addPriorityFee)
        .add(clickInstruction);

      transaction.partialSign(userAccount);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        ...options,
        preflightCommitment: 'processed',
        maxRetries: 10
      });

      /*
      setTransactions(txs => {
        if (!txs.find(tx => tx[0] === kind && tx[1] === signature)) {
          return [[kind, signature, 'sent'], ...txs.slice(0, 99)];
        }
        return txs;
      });
       */

      connection.onSignature(signature, callback(signature), 'confirmed');

      return signature;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const mint = async (
    userAccount: Keypair,
    round: number,
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

    const idl = x1Game as X1Game;
    const provider = new AnchorProvider(connection, null, anchorOptions);

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const {
      x1GameStateAccount,
      x1GameRoundAccount,
      x1GameUserRoundAccount,
      x1GameUserAccount,
      mintAccount,
      userTokenAccount
    } = await getPDAs(program.programId, userAccount, round, connection);

    const associateTokenProgram = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

    const mintAccounts = {
      user: userAccount.publicKey,
      mintAccount: mintAccount.address,
      userTokenAccount,
      x1GameState: x1GameStateAccount,
      x1RoundState: x1GameRoundAccount,
      x1UserRoundState: x1GameUserRoundAccount,
      x1UserState: x1GameUserAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      associateTokenProgram
    };

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: options?.priorityFee || priorityFee || DEFAULT_PRIORITY_FEE
    });

    try {
      const mintInstruction = await program.methods
        .mint(new BN(round))
        .accounts(mintAccounts)
        .instruction();

      const recentBlockhash = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: userAccount.publicKey,
        recentBlockhash: recentBlockhash.blockhash
      })
        .add(addPriorityFee)
        .add(mintInstruction);

      transaction.partialSign(userAccount);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        ...options,
        preflightCommitment: 'processed',
        maxRetries: 10
      });

      connection.onSignature(signature, callback(signature), 'confirmed');

      /*
      setTransactions(txs => {
        if (!txs.find(tx => tx[1] === signature)) {
          return [[-1, signature, 'sent'], ...txs.slice(0, 99)];
        }
        return txs;
      });
       */

      return signature;
    } catch (e) {
      console.error(e);
      return null;
    }
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
    <X1GameContext.Provider
      value={{
        priorityFee,
        transactions,
        getX1GameState,
        getUserTokenBalance,
        setPriorityFee,
        click,
        mint,
        checkTx,
        updateTx
      }}
    >
      {children}
    </X1GameContext.Provider>
  );
};
