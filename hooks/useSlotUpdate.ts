import type { SlotUpdate } from '@solana/web3.js';
import { useContext, useEffect } from 'react';

import { X1Context } from '@/contexts/X1';

export const useSlotUpdate = (onSlotUpdate: (s: SlotUpdate) => any) => {
  const { connection } = useContext(X1Context);

  useEffect(() => {
    let onSlotId;
    let onRootChangeId;
    if (connection) {
      onSlotId = connection.onSlotUpdate(slotUpdate => {
        if (slotUpdate.type === 'frozen') {
          onSlotUpdate(slotUpdate);
        }
      });
      // onRootChangeId = connection.onRootChange(console.log);
    }
    return () => {
      if (connection) {
        connection.removeSlotUpdateListener(onSlotId);
        connection.removeRootChangeListener(onRootChangeId);
      }
    };
  }, [!!connection]);
};
