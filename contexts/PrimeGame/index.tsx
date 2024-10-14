import { AnchorProvider, Program } from '@coral-xyz/anchor';
// import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import type { Keypair, SignatureResultCallback } from '@solana/web3.js';
import { PublicKey, Transaction } from '@solana/web3.js';
import { createContext, useContext, useState } from 'react';

import { ThemeContext } from '@/contexts/Theme';
import { X1Context } from '@/contexts/X1';

import type { PrimeSlotChecker } from './prime_slot_checker';
import primeSlotChecker from './prime_slot_checker.json';

export type TTx = [number, string, string];

export type TPrimeGameContext = {
  txs: TTx[];

  getGameState: (u: any) => any;
  initUser: (u: any, o: any, cb: () => any) => any;
  buyPoints: (u: any, o: any, cb: () => any) => any;
  checkNumber: (u: any, o: any, cb: () => any) => any;
};

const initialState: TPrimeGameContext = {
  txs: [],

  getGameState: (u: any) => {},
  initUser: (u: any, o: any, cb: () => any) => {},
  buyPoints: (u: any, o: any, cb: () => any) => {},
  checkNumber: (u: any, o: any, cb: () => any) => {}
};

export const PrimeGameContext = createContext<TPrimeGameContext>(initialState);

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

const getPDAs = async (programId: PublicKey, user: Keypair) => {
  const [jackpotAccount] = PublicKey.findProgramAddressSync([Buffer.from('jackpot')], programId);

  const [treasuryAccount] = PublicKey.findProgramAddressSync([Buffer.from('treasury')], programId);

  const [playersAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('player_list')],
    programId
  );

  const [leaderboardAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('leaderboard')],
    programId
  );

  const [totalWonPointsAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('total_won_points')],
    programId
  );

  const [stakingTreasuryAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('staking_treasury')],
    programId
  );

  const [uerAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from('user'), user.publicKey.toBuffer()],
    programId
  );

  return {
    jackpotAccount,
    treasuryAccount,
    playersAccount,
    leaderboardAccount,
    uerAccount,
    totalWonPointsAccount,
    stakingTreasuryAccount
  };
};

const gameProgramId =
  process.env.NEXT_PUBLIC_PRIME_GAME_PROGRAM_ID || '3RTzsw2nuhkxKzckRyVbvvP6GEAxzetjn3YXAVHr42vb';

export const PrimeGameProvider = ({ children }) => {
  const { isLarge, isExtraLarge } = useContext(ThemeContext);
  const isSmall = !isLarge && !isExtraLarge;
  const maxTxs = isSmall ? 50 : 100;
  const { connection } = useContext(X1Context);
  const [txs, setTxs] = useState<TTx[]>(Array(maxTxs).fill([0, null, null] as TTx));

  const getGameState = async (userAccount: Keypair) => {
    const idl = primeSlotChecker as PrimeSlotChecker;
    const provider = new AnchorProvider(connection, null, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);
    const {
      jackpotAccount,
      treasuryAccount,
      playersAccount,
      leaderboardAccount,
      uerAccount,
      totalWonPointsAccount,
      stakingTreasuryAccount
    } = await getPDAs(program.programId, userAccount);

    let jackpotState = null;
    let treasuryState = null;
    let stakingTreasuryState = null;
    let totalWonPointsState = null;
    let playersState = null;
    let leaderboardState = null;
    let userState = null;

    try {
      jackpotState = await program.account.jackpot.fetch(jackpotAccount);
    } catch (_) {
      // console.error(e);
    }
    try {
      treasuryState = await provider.connection.getBalance(treasuryAccount);
    } catch (_) {
      // console.error(e);
    }
    try {
      playersState = await program.account.playerList.fetch(playersAccount);
    } catch (_) {
      // console.error(e);
    }
    try {
      leaderboardState = await program.account.leaderboard.fetch(leaderboardAccount);
    } catch (_) {
      // console.error(e);
    }
    try {
      userState = await program.account.user.fetch(uerAccount);
    } catch (_) {
      // console.error(e);
    }
    try {
      stakingTreasuryState = await provider.connection.getBalance(stakingTreasuryAccount);
    } catch (_) {
      // console.error(e);
    }
    try {
      totalWonPointsState = await program.account.totalWonPoints.fetch(totalWonPointsAccount);
    } catch (_) {
      // console.error(e);
    }
    return {
      jackpotState,
      treasuryState,
      playersState,
      leaderboardState,
      userState,
      stakingTreasuryState,
      totalWonPointsState
    };
  };

  const updateTx = (signature: string, status: string) => {
    setTxs(txs => {
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

  const buyPoints = async (
    user: Keypair,
    options?: any,
    callback?: (h: string) => SignatureResultCallback
  ) => {
    const idl = primeSlotChecker as PrimeSlotChecker;
    const wallet = null; // {} as Wallet;
    const provider = new AnchorProvider(connection, wallet, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const { treasuryAccount, uerAccount } = await getPDAs(program.programId, user);

    const anchorOptions = {
      // ...AnchorProvider.defaultOptions(),
      skipPreflight: true,
      commitment: 'processed',
      preflightCommitment: 'processed',
      maxRetries: 10
      // minContextSlot: 0
    } as any;

    const payForPointsAccounts = {
      user: uerAccount,
      payer: user.publicKey,
      treasury: treasuryAccount,
      programId: program.programId
    };

    try {
      const txInstruction = await program.methods
        .payForPoints(0)
        .accounts(payForPointsAccounts)
        .signers([])
        .preInstructions([])
        .instruction();

      const recentBlockhash = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: user.publicKey,
        recentBlockhash: recentBlockhash.blockhash
      }).add(txInstruction);

      transaction.partialSign(user);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        ...options,
        preflightCommitment: 'processed',
        maxRetries: 10
      });

      connection.onSignature(signature, callback as any, 'confirmed');

      return signature;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const initUser = async (
    user: Keypair,
    options?: any,
    callback?: (h: string) => SignatureResultCallback
  ) => {
    const idl = primeSlotChecker as PrimeSlotChecker;
    const wallet = null; // {} as Wallet;
    const provider = new AnchorProvider(connection, wallet, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const { treasuryAccount, uerAccount } = await getPDAs(program.programId, user);

    const anchorOptions = {
      // ...AnchorProvider.defaultOptions(),
      skipPreflight: true,
      commitment: 'processed',
      preflightCommitment: 'processed',
      maxRetries: 10
      // minContextSlot: 0
    } as any;

    const initUserAccounts = {
      user: uerAccount,
      payer: user.publicKey,
      treasury: treasuryAccount,
      programId: program.programId
    };

    try {
      const txInstruction = await program.methods
        .initializeUser(0)
        .accounts(initUserAccounts)
        .signers([])
        // .preInstructions([])
        .instruction();

      const recentBlockhash = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: user.publicKey,
        recentBlockhash: recentBlockhash.blockhash
      }).add(txInstruction);

      transaction.partialSign(user);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        ...options,
        preflightCommitment: 'processed',
        maxRetries: 10
      });

      connection.onSignature(signature, callback as any, 'confirmed');

      return signature;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const checkNumber = async (
    user: Keypair,
    options?: any,
    callback?: (h: string) => SignatureResultCallback
  ) => {
    const idl = primeSlotChecker as PrimeSlotChecker;
    const wallet = null; // {} as Wallet;
    const provider = new AnchorProvider(connection, wallet, {});

    // Generate the program client from IDL.
    const program = new Program(idl, provider);

    const { jackpotAccount, treasuryAccount, playersAccount, leaderboardAccount, uerAccount } =
      await getPDAs(program.programId, user);

    const anchorOptions = {
      // ...AnchorProvider.defaultOptions(),
      skipPreflight: true,
      commitment: 'processed',
      preflightCommitment: 'processed',
      maxRetries: 10
      // minContextSlot: 0
    } as any;

    const checkSlotAccounts = {
      user: uerAccount,
      payer: user.publicKey,
      jackpot: jackpotAccount,
      treasury: treasuryAccount,
      playersList: playersAccount,
      leaderboard: leaderboardAccount,
      programId: program.programId
    };

    try {
      const txInstruction = await program.methods
        .checkSlot(0)
        .accounts(checkSlotAccounts)
        .signers([])
        .preInstructions([])
        .instruction();

      const recentBlockhash = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: user.publicKey,
        recentBlockhash: recentBlockhash.blockhash
      }).add(txInstruction);

      transaction.partialSign(user);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        ...options,
        preflightCommitment: 'processed',
        maxRetries: 10
      });

      const cb = (s: string) => {
        console.log('finalized', s);
        updateTx(signature, 'confirmed');
      };

      connection.onSignature(signature, callback as any, 'confirmed');
      connection.onSignature(signature, cb as any, 'finalized');

      setTxs(txs => {
        if (!txs.find(tx => tx[1] === signature)) {
          txs.push([-1, signature, 'sent']);
          // return [[-1, signature, 'sent'], ...txs.slice(0, 99)];
        }
        if (txs.length > maxTxs) {
          return txs.slice(-maxTxs);
        }
        return txs;
      });

      return signature;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return (
    <PrimeGameContext.Provider
      value={{
        txs,

        getGameState,
        initUser,
        buyPoints,
        checkNumber
        // checkTx
      }}
    >
      {children}
    </PrimeGameContext.Provider>
  );
};
