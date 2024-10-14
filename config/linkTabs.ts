import { publicRuntimeConfig as config } from './runtimeConfig';
import type { LinkTabProps } from './types';

export const linkTabs = (networkId = config.defaultNetworkId): LinkTabProps[] => [
  {
    label: 'X1',
    value: 'x1',
    items: [
      { label: 'Moon Party', value: 'moon-party', href: `/x1/moon-party` },
      { label: 'Burnerboard', value: 'burnerboard', href: `/x1/burnerboard` }
    ]
  },
  {
    label: 'Resources',
    value: 'resources',
    items: [
      { label: 'X1 Docs', value: 'x1_docs', href: `https://docs.x1.xyz` },
      { label: 'Xolana Testnet', value: 'testnet', href: `https://xolana.xen.network/` },
      { label: 'Community Blog', value: 'blog', href: `https://www.xencrypto.io/category/blog/` },
      { label: 'Legal', value: 'legal', href: `/legal` }
    ]
  }
];
