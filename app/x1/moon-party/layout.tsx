import React from 'react';

import { VmpxProvider } from '@/contexts/VMPX';
import { XenCryptoProvider } from '@/contexts/XenCrypto';
import { XenTorrentProvider } from '@/contexts/XenTorrent';
import { XoneProvider } from '@/contexts/XONE';

const MoonPartyLayout = ({ children }: { children: React.ReactNode }) => (
  <XenCryptoProvider>
    <XenTorrentProvider>
      <VmpxProvider>
        <XoneProvider>{children}</XoneProvider>
      </VmpxProvider>
    </XenTorrentProvider>
  </XenCryptoProvider>
);

export default MoonPartyLayout;
