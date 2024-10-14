import type { Provider } from '@coral-xyz/anchor';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import type { Connection, SignatureResultCallback } from '@solana/web3.js';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { createContext, useEffect, useState } from 'react';

export type TSolanaContext = {
  connection: Connection | null;
  provider: Provider | null;
  balance: any | null;
  connected: boolean;

  setConnection: (a: Connection) => any;
  getBalance: (a: string) => any;
  fundWallet: (a: string, n: number, cb: any) => any;
};

const initialState: TSolanaContext = {
  connection: null,
  provider: null,
  balance: null,
  connected: false,

  setConnection: () => {},
  getBalance: () => {},
  fundWallet: () => {}
};

export const SolanaContext = createContext<TSolanaContext>(initialState);

export const SolanaProvider = ({ children }) => {
  // const { safeRows } = useContext(ThemeContext);
  const { publicKey, connected, sendTransaction } = useWallet();
  // const safeRows = 4;
  const [balance, setBalance] = useState<bigint>();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (connected && !connection) {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
      const rpcURL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'ws://localhost:8900';
      const schema = process.env.NEXT_PUBLIC_VERCEL_URL.includes('localhost') ? 'http' : 'https';
      // const connection = new Connection(`${schema}://${baseUrl}/api/sol`, {
      //   wsEndpoint: rpcURL.replace('http', 'ws')
      // });
      // setConnection(connection);
    }
  }, [connected, !!connection]);

  useEffect(() => {
    if (connection && !provider) {
      const provider = new AnchorProvider(connection, null, {});
      setProvider(provider);
    }
  }, [!!connection, !!provider]);

  useEffect(() => {
    if (connection && publicKey) {
      connection
        .getBalance(publicKey)
        .then((balance: any) => {
          setBalance(BigInt(balance));
        })
        .catch((err: any) => console.error(err));
    }
  }, [balance, publicKey, !!connection]);

  const getBalance = async (account: string | { publicKey: any }) => {
    if (typeof account === 'object') {
      return connection.getBalance(account.publicKey).then((balance: any) => balance);
    }
    return connection.getBalance(new PublicKey(account)).then((balance: any) => balance);
  };

  const fundWallet = async (
    accountTo: string,
    amount: number,
    callback?: SignatureResultCallback
  ) => {
    if (publicKey && connection) {
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(accountTo),
        lamports: amount || 1_000
      });
      const recentBlockhash = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: recentBlockhash.blockhash
      }).add(transferInstruction);

      const hash = await sendTransaction(transaction, connection);
      connection.onSignature(hash, callback, 'confirmed');
      return hash;
    }

    return null;
  };

  return (
    <SolanaContext.Provider
      value={{
        connection,
        setConnection,
        provider,
        balance,
        getBalance,
        fundWallet,
        connected
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};
