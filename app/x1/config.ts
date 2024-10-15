import { cookieStorage, createConfig, createStorage, http, webSocket } from 'wagmi';
import type { Chain } from 'wagmi/chains';

import { publicRuntimeConfig } from '@/app/libs/runtimeConfig';
import { chains as allChains } from '@/config/chains';
import networks from '@/config/networks';

const supportedNetworks = networks({ config: publicRuntimeConfig });
const { isTestnet } = publicRuntimeConfig;

const supportedChainIds = Object.values(supportedNetworks)
  .filter(n => n.isTestnet === !!isTestnet)
  .map(n => Number(n.chainId));

const supportedChains = allChains.filter(chain => supportedChainIds.includes(chain.id));

const chainById = (id: number) =>
  Object.values(supportedNetworks).find(n => Number(n.chainId) === id) ||
  supportedNetworks?.mainnet;

const getRPCs = (chain: Chain) => ({
  http: Array.isArray(chainById(chain.id)?.rpcURL)
    ? chainById(chain.id)?.rpcURL?.[0]
    : (chainById(chain.id)?.rpcURL as string),
  webSocket: Array.isArray(chainById(chain.id)?.wsURL)
    ? chainById(chain.id)?.wsURL?.[0]
    : (chainById(chain.id)?.wsURL as string)
});

const transports = supportedChains.reduce((res, chain) => {
  res[chain.id] = getRPCs(chain).webSocket
    ? webSocket(getRPCs(chain).webSocket)
    : http(getRPCs(chain).http);
  return res;
}, {});

export const wagmiConfig = createConfig({
  // appName: 'Xen Network',
  // projectId: publicRuntimeConfig?.walletConnectApiKey || '',
  chains: supportedChains as any,
  // ssr: true,
  transports,
  storage: createStorage({
    storage: cookieStorage
  })
});
