import type { Provider } from '@coral-xyz/anchor';
import { AnchorProvider } from '@coral-xyz/anchor';
import type { Keypair, SignatureResultCallback, SlotUpdate } from '@solana/web3.js';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';
import { createContext, useEffect, useState } from 'react';

export type TX1Context = {
  connection: Connection | null;
  provider: Provider | null;
  balance: any | null;
  block: SlotUpdate | any;

  getBalance: (a: string) => any;
  getAirdrop: (a: PublicKey, n: number, cb: any) => any;
  sendTx: (a: Keypair, n: number, cb: any, opts: any) => any;
};

const initialState: TX1Context = {
  connection: null,
  provider: null,
  balance: null,
  block: null,

  getBalance: () => {},
  getAirdrop: () => {},
  sendTx: () => {}
};

const uniqueTxs = new Set<string>();

export const X1Context = createContext<TX1Context>(initialState);

export const X1Provider = ({ children }) => {
  // const { safeRows } = useContext(ThemeContext);
  // const safeRows = 4;
  const [balance, setBalance] = useState<bigint>();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [block, setBlock] = useState<SlotUpdate>();

  useEffect(() => {
    if (!connection) {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
      const rpcURL = process.env.NEXT_PUBLIC_X1_RPC_URL || 'ws://localhost:8900';
      const schema = process.env.NEXT_PUBLIC_VERCEL_URL.includes('localhost') ? 'http' : 'https';
      const connection = new Connection(`${schema}://${baseUrl}/api/x1`, {
        wsEndpoint: rpcURL.replace('http', 'ws')
      });
      setConnection(connection);
    }
  }, [!!connection]);

  useEffect(() => {
    if (connection && !provider) {
      const provider = new AnchorProvider(connection, null, {});
      setProvider(provider);
    }
  }, [!!connection, !!provider]);

  const getBalance = async (account: string | { publicKey: any }) => {
    if (typeof account === 'object') {
      return connection.getBalance(account.publicKey).then((balance: any) => balance);
    }
    return connection.getBalance(new PublicKey(account)).then((balance: any) => balance);
  };

  const getAirdrop = async (
    accountTo: PublicKey,
    amount: number,
    callback?: SignatureResultCallback
  ) => {
    if (connection) {
      const hash = await connection.requestAirdrop(accountTo, amount);
      console.log(hash);
      connection.onSignature(hash, callback, 'finalized');
      return hash;
    }

    return null;
  };

  const sendTx = async (
    userAccount: Keypair,
    amount: number,
    callback = () => {},
    opts: any = {}
  ) => {
    const testInstruction = new TransactionInstruction({
      keys: [{ pubkey: userAccount.publicKey, isSigner: true, isWritable: true }],
      programId: SystemProgram.programId,
      data: Buffer.alloc(0)
    });
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: userAccount.publicKey,
      toPubkey: userAccount.publicKey,
      lamports: amount || 1_000
    });
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      feePayer: userAccount.publicKey,
      recentBlockhash: recentBlockhash.blockhash
    }).add(transferInstruction);

    try {
      transaction.partialSign(userAccount);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        ...opts,
        // preflightCommitment: 'processed',
        skipPreflight: true,
        maxRetries: 1
      });
      if (!uniqueTxs.has(signature)) {
        uniqueTxs.add(signature);
        connection.onSignature(
          signature,
          () => {
            callback();
            uniqueTxs.delete(signature);
          },
          opts.commitment || 'confirmed'
        );
      }
      return signature;
    } catch (e) {
      console.error(e.message);
      return null;
    }
  };

  return (
    <X1Context.Provider
      value={{
        connection,
        provider,
        balance,
        block,
        getBalance,
        getAirdrop,
        sendTx
      }}
    >
      {children}
    </X1Context.Provider>
  );
};
