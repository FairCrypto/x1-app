'use client';

import type { Provider } from '@sats-connect/core';
import { AddressPurpose, getProviders, request } from '@sats-connect/core';
import { useEffect, useState } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useXverse = () => {
  const [available, setAvailable] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useLocalStorage<string>('xverse-accounts', '');
  useEffect(() => {
    if (typeof window !== 'undefined' && !available) {
      const providers: Provider[] = getProviders();
      if (providers.length > 0) {
        request('getInfo', null)
          .then(response => {
            console.log('getInfo', response);
            if (response?.status === 'success') {
              setAvailable(true);
              if (accounts) {
                setConnected(true);
              }
            }
          })
          .catch(e => {
            // do nothing
          });
      }
    }
  }, [available]);

  const requestAccounts = async () => {
    const response = await request('getAccounts', {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment]
    });
    console.log('getAccounts', response);
    if (response?.status === 'success') {
      return response.result;
    }
    return [];
  };

  const getAccounts = async () => {
    if (accounts) {
      return JSON.parse(accounts);
    }
    const response = await request('getAddresses', {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment]
    });
    console.log('getAddresses', response);
    if (response?.status === 'success') {
      setAccounts(JSON.stringify(response.result.addresses));
      return response.result.addresses;
    }
    return [];
  };

  return {
    available,
    connected,
    requestAccounts,
    getAccounts
  };
};
