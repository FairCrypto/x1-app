import React from 'react';

import { MoonPartyProvider } from '@/contexts/MoonParty';
import { VmpxProvider } from '@/contexts/VMPX';
import { XenCryptoProvider } from '@/contexts/XenCrypto';
import { XenTorrentProvider } from '@/contexts/XenTorrent';
import { XoneProvider } from '@/contexts/XONE';

const MoonPartyLayout = ({ children }: { children: React.ReactNode }) => (
  <XenCryptoProvider>
    <XenTorrentProvider>
      <VmpxProvider>
        <XoneProvider>
          <MoonPartyProvider>{children}</MoonPartyProvider>
        </XoneProvider>
      </VmpxProvider>
    </XenTorrentProvider>
  </XenCryptoProvider>
);

export default MoonPartyLayout;
