'use client';

// import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';

type TCurrentNetworkContext = {
  networkId: string;
  config: any;
  onNetworkMismatch: (walletNetworkId: string) => Promise<string | null>;
};

const initialValue: TCurrentNetworkContext = {
  networkId: 'mainnet',
  config: {},
  onNetworkMismatch: _ => Promise.resolve(null)
};

export const CurrentNetworkContext = createContext<TCurrentNetworkContext>(initialValue);

export const CurrentNetworkProvider = ({
  children,
  networkId: currentNetworkId,
  config: publicRuntimeConfig
}) => {
  // const router = useRouter();
  const [networkId, setNetworkId] = useState(currentNetworkId);
  const [config, setConfig] = useState(publicRuntimeConfig);

  const handleRouteChange = (url = '/') => {
    setNetworkId(url.split('/')[1]);
  };

  useEffect(() => {
    setConfig(publicRuntimeConfig);
  }, [publicRuntimeConfig]);

  /*
  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
   */

  const onNetworkMismatch = (walletNetworkId: string) =>
    /*
    const subPath = path
      .replace(networkId, '')
      .replace(/\//, '');
    if (networkId) {
      const url = `/${walletNetworkId}/${subPath}`;
      return router.replace(url)
        .then(() => walletNetworkId);
    } else {
      return Promise.resolve(networkId);
    }
     */
    Promise.resolve(walletNetworkId);

  return (
    <CurrentNetworkContext.Provider value={{ networkId, onNetworkMismatch, config }}>
      {children}
    </CurrentNetworkContext.Provider>
  );
};
