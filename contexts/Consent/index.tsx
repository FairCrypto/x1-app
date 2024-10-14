import { verifyMessage } from '@ethersproject/wallet';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

import networks from '@/config/networks';
import { Web3Context } from '@/contexts/Web3';

export type TConsentContext = {
  verifyTermsAcceptance: () => Promise<boolean>;
  requestTermsAcceptance: () => Promise<boolean>;
  termsAccepted: boolean | null;
};

const initialState: TConsentContext = {} as TConsentContext;

export const ConsentContext = createContext<TConsentContext>(initialState);

export const ConsentProvider = ({ children }) => {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: chain?.id });
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const config = useContext(Web3Context);
  const supportedNetworks = networks({ config });
  const currentNetwork = Object.values(supportedNetworks).find(
    n => Number(n?.chainId) === Number(chain?.id)
  );
  const networkId = currentNetwork?.networkId;

  const verifyTermsAcceptance = async () => {
    if (networkId && address) {
      const key = `${networkId}-${address}`;
      try {
        const signature = localStorage.getItem(key);
        if (signature) {
          return await fetch('/terms_short.txt')
            .then(res => (res.ok ? res.text() : Promise.reject(res.status)))
            .then(terms => verifyMessage(terms, signature))
            .then(signerAccount => {
              setTermsAccepted(
                !!signerAccount && signerAccount?.toLowerCase() === address?.toLowerCase()
              );
              return signerAccount === address;
            })
            .catch(e => {
              setTermsAccepted(false);
              return false;
            });
        }
        setTermsAccepted(false);
        return false;
      } catch (e) {
        setTermsAccepted(false);
        return false;
      }
    } else {
      setTermsAccepted(null);
      return false;
    }
  };

  const requestTermsAcceptance = async () => {
    if (networkId && address && walletClient) {
      const key = `${networkId}-${address}`;
      try {
        return await fetch('/terms_short.txt')
          .then(res => (res.ok ? res.text() : Promise.reject(res.status)))
          .then(terms => walletClient.signMessage({ account: address, message: terms }))
          .then(val => localStorage.setItem(key, val))
          .then(_ => setTermsAccepted(true))
          .then(_ => true)
          .catch(_ => false);
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    verifyTermsAcceptance().then(_ => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsAccepted, networkId, address]);

  return (
    <ConsentContext.Provider
      value={{
        verifyTermsAcceptance,
        requestTermsAcceptance,
        termsAccepted
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};
