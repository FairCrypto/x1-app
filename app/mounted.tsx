'use client';

import { createContext, useEffect, useState } from 'react';

export const MountedContext = createContext(null);

const MountedProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  return <MountedContext.Provider value={null}>{mounted && children}</MountedContext.Provider>;
};

export default MountedProvider;
