import { debug } from 'debug';
import { createContext, useContext, useEffect, useState } from 'react';

import { publicRuntimeConfig } from '@/config/runtimeConfig';
import { useIndexedDB } from '@/hooks/useIndexedDB';

import networks from '../../config/networks';
import Store from '../../shared/idbKeyValStore';
import { CurrentNetworkContext } from '../CurrentNetwork';

const log = debug('context:storage');

const supportedNetworks = networks({ config: publicRuntimeConfig });

const initialState = {};

/*
  Using IndexedDb Storage:
    DB: goerli-xen-crypto
    Stores:
      - state:
        xen: {}
        torrent: {}
        ...
      - accounts:
        addr0: {
          portfolio: true
          balance: 0
          mintInfo: {}
          stakeInfo: {}
          xenft: {
            id1 : {},
            id2 : {},
            id3 : {}
          }
        addr1: {}
      - transactions:
        hash1: {

        }



 */

export const StorageContext = createContext<any>(initialState);

export const StorageProvider = ({ children }) => {
  const { networkId } = useContext(CurrentNetworkContext);

  const initDatabases = () => {
    if (typeof window === 'undefined') return {};
    return Object.keys(supportedNetworks).reduce((res, nid) => {
      res[nid] = Store.getDefaultStore(nid, null);
      return res;
    }, {});
  };

  const initStatus = () =>
    Object.keys(supportedNetworks).reduce((res, nid) => {
      res[nid] = false;
      return res;
    }, {});

  const initAccounts = () =>
    Object.keys(supportedNetworks).reduce((res, nid) => {
      res[nid] = [];
      return res;
    }, {});

  const [databases] = useState<Record<string, Store>>(initDatabases);
  const [dbStatus, setDbStatus] = useState(initStatus);
  const [tracked, setTrackedAccounts] = useState(initAccounts);
  const {
    readState: dbReadState,
    writeState: dbWriteState,
    addAccount: dbAddAccount,
    removeAccount: dbRemoveAccount,
    hasAccount: dbHasAccount,
    getAccounts: dbGetAccounts
  } = useIndexedDB();

  // useEffect(() => {
  //  if (networkId) {
  //    setDbStatus((s) => ({...s, [networkId]: false }));
  //    // initDb(Store.getDefaultStore(networkId, null));
  //  }
  // }, [networkId])

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [id, db] of Object.entries(databases)) {
      db.ready()
        .then(_ => setDbStatus(s => ({ ...s, [id]: true })))
        .catch(e => setDbStatus(s => ({ ...s, [id]: e })));
    }
  }, []);

  const networkDbStatus = dbStatus[networkId];
  useEffect(() => {
    if (networkDbStatus === true) {
      dbGetAccounts(databases[networkId])().then(accounts =>
        setTrackedAccounts(s => ({ ...s, [networkId]: accounts }))
      );
    }
  }, [networkDbStatus, networkId]);

  const addAccount = (account, netId?) => {
    if (dbStatus[netId || networkId] === true) {
      return dbHasAccount(databases[netId || networkId])(account).then(has => {
        log('add', account, !!has, dbStatus);
        if (!has) {
          dbAddAccount(databases[netId || networkId])(account).then(added => {
            if (added) {
              setTrackedAccounts(s => ({
                ...s,
                [netId || networkId]: [...s[netId || networkId], account]
              }));
            }
          });
        }
      });
    }
    return Promise.resolve();
  };

  const removeAccount = (account, netId?) => {
    if (dbStatus[netId || networkId] === true) {
      return dbHasAccount(databases[netId || networkId])(account).then(has => {
        log('remove', account, !!has, dbStatus);
        if (has) {
          dbRemoveAccount(databases[netId || networkId])(account).then(removed => {
            if (removed) {
              log('removed', account, !!has, dbStatus);
              setTrackedAccounts(s => ({
                ...s,
                [netId || networkId]: [...s[netId || networkId].filter(a => a !== account)]
              }));
            }
          });
        }
      });
    }
    return Promise.resolve();
  };

  const hasAccount = (account, netId?) => {
    if (dbStatus[netId || networkId] === true) {
      return dbHasAccount(databases[netId || networkId])(account);
    }
    return Promise.resolve();
  };

  const getAccounts = (netId?) => {
    if (dbStatus[netId || networkId] === true) {
      return dbGetAccounts(databases[netId || networkId])();
    }
    return Promise.resolve();
  };

  const readState = (netId?, slice?) => () => {
    if (dbStatus[netId || networkId] === true) {
      return dbReadState(databases[netId || networkId], slice)();
    }
    return Promise.resolve();
  };

  const writeState = (netId?, slice?) => state => {
    if (dbStatus[netId || networkId] === true) {
      return dbWriteState(databases[netId || networkId], slice)(state);
    }
    return Promise.resolve();
  };

  const db = networkId && databases[networkId];
  const trackedAccounts = networkId && tracked[networkId];
  const getDb = id => databases[id];

  return (
    <StorageContext.Provider
      value={{
        db,
        dbStatus,
        trackedAccounts,
        tracked,
        getDb,
        readState,
        writeState,
        addAccount,
        hasAccount,
        removeAccount,
        getAccounts
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};
