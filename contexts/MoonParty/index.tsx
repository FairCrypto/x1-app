'use client';

import React, { createContext, useEffect, useState } from 'react';

type TMoonPartyContext = {
  endTs?: number;
  xntDistribution?: bigint;
  burnPointsAllocated?: bigint;
};

export const MoonPartyContext = createContext<TMoonPartyContext>({});

export const MoonPartyProvider = ({ children }) => {
  const [state, setState] = useState<TMoonPartyContext>({
    endTs: Date.now() + 100 * 24 * 3600 * 1000,
    xntDistribution: 10_000_000n * BigInt('1000000000000000000'),
    burnPointsAllocated: 3000_000n * BigInt('1000000000000000000')
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState({
        ...state,
        xntDistribution: state.xntDistribution! * 2n
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, []);

  return <MoonPartyContext.Provider value={state}>{children}</MoonPartyContext.Provider>;
};
