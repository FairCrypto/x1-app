import { createContext, useContext, useEffect, useState } from 'react';

import { ThemeContext } from '@/contexts/Theme';
import { useInscriptions } from '@/hooks/useInscriptions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUnisat } from '@/hooks/useUnisat';
import { useXverse } from '@/hooks/useXverse';
import { dedupeArray } from '@/shared/dedupeArray';

import type { TBRCAsset, TInscription } from './types';

export type TBtcContext = {
  preferredWallet: string | undefined;
  available: boolean;
  unisatAvailable: boolean;
  xverseAvailable: boolean;
  connected: boolean;
  balance: any | null;
  accounts: string[] | null;
  assets: TInscription[];
  data: TBRCAsset[];
  total: number;
  requestAccounts: (id: string) => any;
  setAccounts: any;
  setConnected: any;
  fetchNextPage: ({ page }: { page: number }) => Promise<void>;
  fetchAllInscriptions?: (total: number) => Promise<void>;
};

const initialState: TBtcContext = {
  preferredWallet: undefined,
  available: false,
  unisatAvailable: false,
  xverseAvailable: false,
  connected: false,
  balance: null,
  accounts: null,
  assets: [],
  data: [],
  total: 0,
  requestAccounts: _ => {},
  setAccounts: () => {},
  setConnected: () => {},
  fetchNextPage: () => Promise.resolve(),
  fetchAllInscriptions: (_: number) => Promise.resolve()
};

export const BtcContext = createContext<TBtcContext>(initialState);

export const BtcProvider = ({ children }) => {
  const { safeRows } = useContext(ThemeContext);
  const [preferredWallet, setPreferredWallet] = useLocalStorage('btc-preferred-wallet');
  // const safeRows = 4;
  const [unisatAvailable, setUnisatAvailable] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<bigint>();
  const [accounts, setAccounts] = useState<string[] | null>();
  const [assets, setAssets] = useState<TInscription[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [connecting, setConnecting] = useState<boolean>(false);
  const { unisat } = useUnisat();
  const {
    available: xverseAvailable,
    requestAccounts: requestXverseAccounts,
    getAccounts
  } = useXverse();
  const { data, setSize } = useInscriptions(assets, safeRows);
  const available =
    (unisatAvailable && preferredWallet === 'unisat') ||
    (xverseAvailable && preferredWallet === 'xverse');

  useEffect(() => {
    if (!unisatAvailable && unisat) {
      setUnisatAvailable(true);
      if (preferredWallet === 'unisat') {
        console.log('try unisat connection', unisatAvailable, unisat);
        unisat.getAccounts().then((accounts: string[]) => {
          if (accounts) {
            setAccounts(accounts);
          }
        });
      }
    } else if (preferredWallet === 'xverse' && !connecting) {
      setConnecting(true);
      console.log('try xverse connection', xverseAvailable);
      getAccounts().then(accounts => {
        setConnecting(false);
        setAccounts(accounts.map((a: any) => a.address));
      });
    }
  }, [unisatAvailable, unisat, xverseAvailable, preferredWallet]);

  useEffect(() => {
    if (accounts && accounts[0]) {
      setConnected(true);
    }
  }, [accounts]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const handleAccountsChanged = (_accounts: string[]) => {
      if (_accounts.length > 0) {
        setAccounts(_accounts);
        setConnected(true);
      } else {
        setConnected(false);
        setPreferredWallet(undefined);
      }
    };

    if (unisat) {
      unisat.on('accountsChanged', handleAccountsChanged);
      // unisat.on("networkChanged", handleNetworkChanged);

      return () => {
        unisat.removeListener('accountsChanged', handleAccountsChanged);
        // unisat.removeListener("networkChanged", handleNetworkChanged);
      };
    }
  }, [unisat]);

  useEffect(() => {
    if (connected && unisat) {
      unisat
        .getBalance()
        .then((balance: bigint) => setBalance(balance))
        .then(() => unisat.getInscriptions(offset, safeRows))
        .then((aa: any) => {
          setAssets(aa.list);
          setTotal(aa.total);
        });
    }
  }, [connected, unisat, accounts]);

  const fetchNextPage = async ({ page }: { page: number }) => {
    if (page * safeRows > total) return;
    setOffset(page * safeRows);
    unisat?.getInscriptions(page * safeRows, safeRows).then(aa => {
      console.log('fetching next page', page, aa.list);
      setAssets(current => dedupeArray([...current, ...aa.list], 'inscriptionId'));
    });
  };

  const test = {
    address: 'bc1pecqy8xq9ycxv675hlu9fuftcfkxr3mamhlvum4csaf3pgnejejfs6nrdeu',
    content:
      'https://ordinals.com/content/a9cb2f30df8f22a2d395e0923ab0a6f9b729c3043a86a6855bb5554b26e277c9i0',
    contentBody: '',
    contentLength: 52,
    contentType: 'text/plain;charset=utf-8',
    genesisTransaction: 'a9cb2f30df8f22a2d395e0923ab0a6f9b729c3043a86a6855bb5554b26e277c9',
    inscriptionId: 'a9cb2f30df8f22a2d395e0923ab0a6f9b729c3043a86a6855bb5554b26e277c9i0',
    inscriptionNumber: 4562347,
    location: 'a9cb2f30df8f22a2d395e0923ab0a6f9b729c3043a86a6855bb5554b26e277c9:0:0',
    offset: 0,
    output: 'a9cb2f30df8f22a2d395e0923ab0a6f9b729c3043a86a6855bb5554b26e277c9:0',
    outputValue: 546,
    preview:
      'https://ordinals.com/preview/a9cb2f30df8f22a2d395e0923ab0a6f9b729c3043a86a6855bb5554b26e277c9i0',
    timestamp: 1683514891,
    utxoConfirmation: 51380,
    utxoHeight: 788727
  };

  const fetchAllInscriptions = async (total: number) => {
    const batchSize = 100;
    const batches = Math.ceil(total / batchSize);
    // eslint-disable-next-line no-restricted-syntax
    for await (const i of Array(batches).keys()) {
      const aa = await unisat?.getInscriptions(i * batchSize, batchSize);
      setAssets(current => dedupeArray([...current, ...aa.list], 'inscriptionId'));
    }
  };

  const requestAccounts = async (id: string) => {
    if (id === 'unisat' && unisat) {
      const accounts = await unisat.requestAccounts();
      setAccounts(accounts);
      setConnected(true);
    } else if (id === 'xverse' && xverseAvailable === true) {
      const accounts = await requestXverseAccounts();
      setAccounts(accounts.map((a: any) => a.address));
      setConnected(true);
    }
  };

  useEffect(() => {
    setSize(offset + safeRows);
  }, [assets?.length, offset]);

  return (
    <BtcContext.Provider
      value={{
        preferredWallet,
        available,
        unisatAvailable,
        xverseAvailable,
        connected,
        balance,
        accounts: accounts || [],
        assets,
        data,
        total,
        requestAccounts,
        setAccounts,
        setConnected,
        fetchNextPage,
        fetchAllInscriptions
      }}
    >
      {children}
    </BtcContext.Provider>
  );
};
