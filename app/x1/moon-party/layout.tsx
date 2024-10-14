import React from 'react';

import { XenCryptoProvider } from '@/contexts/XenCrypto';
import { XenTorrentProvider } from '@/contexts/XenTorrent';

const MoonPartyLayout = ({ children }: { children: React.ReactNode }) => (
  <XenCryptoProvider>
    <XenTorrentProvider>{children}</XenTorrentProvider>
  </XenCryptoProvider>
);

export default MoonPartyLayout;
