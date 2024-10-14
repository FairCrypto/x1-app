import { Stores } from '../shared/idbKeyValStore';

export const useIndexedDB = () => {
  const writeState =
    (store, slice = 'global') =>
    state =>
      store ? store.set(Stores.STATE)(slice, state) : Promise.resolve(false);

  const readState =
    (store, slice = 'global') =>
    () =>
      store ? store.get(Stores.STATE)(slice) : Promise.resolve(false);

  const addAccount = store => account =>
    store ? store.set(Stores.ACCOUNTS)(account, Date.now()) : Promise.resolve(false);

  const hasAccount = store => account =>
    store ? store.get(Stores.ACCOUNTS)(account) : Promise.resolve(false);

  const removeAccount = store => account =>
    store ? store.del(Stores.ACCOUNTS)(account) : Promise.resolve(false);

  const getAccounts = store => () =>
    store ? store && store.keys(Stores.ACCOUNTS)() : Promise.resolve(false);

  return {
    addAccount,
    hasAccount,
    removeAccount,
    getAccounts,
    readState,
    writeState
  };
};
