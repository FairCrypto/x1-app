import type EventEmitter from 'node:events';

import { useEffect, useState } from 'react';

export interface IUnisat extends EventEmitter.EventEmitter {
  getAccounts: () => any;
  getBalance: () => any;
  getBitcoinUtxos: () => any;
  getInscriptions: (o: any, c: any) => any;
  getNetwork: () => any;
  getPublicKey: () => any;
  getVersion: () => any;
  initialize: () => any;
  inscribeTransfer: (e: any, t: any) => any;
  isAtomicalsEnabled: () => any;
  keepAlive: () => any;
  pushPsbt: (e: any) => any;
  pushTx: (e: any) => any;
  requestAccounts: () => any;
  sendBitcoin: (e: any, t: any, r: any) => any;
  sendInscription: (e: any, t: any, r: any) => any;
  signData: (e: any, t: any) => any;
  signMessage: (e: any, t: any) => any;
  signPsbt: (e: any, t: any) => any;
  signPbsts: (e: any, t: any) => any;
  switchNetwork: (e: any) => any;
  _state: {
    isConnected: boolean;
    isUnlocked: boolean;
    initialized: boolean;
    isPermanentlyDisconnected: boolean;
  };
}

export const useUnisat = () => {
  // isConnected, isUnlocked, initialized
  const [available, setAvailable] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [isUnlocked, setUnlocked] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [unisat, setUnisat] = useState<IUnisat>();

  useEffect(() => {
    let interval: any;
    if (!unisat && typeof window !== 'undefined') {
      Promise.race([
        new Promise(resolve =>
          // eslint-disable-next-line no-promise-executor-return
          setTimeout(() => {
            if (interval) clearInterval(interval);
            resolve(false);
          }, 1_000)
        ),
        new Promise(resolve => {
          interval = setInterval(() => {
            if ('unisat' in window && typeof window.unisat !== 'undefined') {
              console.log('unisat', (window.unisat as IUnisat)._state.initialized);
              if ((window.unisat as IUnisat)._state.initialized) {
                if (interval) clearInterval(interval);
                resolve(window.unisat);
              }
            }
          }, 200);
        })
      ]).then((u: IUnisat) => {
        if (u) setUnisat(u);
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return { available, unisat, isConnected, isUnlocked, initialized };
};
