'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import { responsiveFontSizes } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { defaultLightTheme, defaultTheme, overrides } from '@/styles/theme';

type TThemeContext = {
  mode: string;
  setMode: (m: string) => void;
  isLarge: boolean;
  isExtraLarge: boolean;
  safeRows: number;
  rkTheme?: any;
};

const initialValue: TThemeContext = {
  mode: 'dark',
  setMode: (_: string) => {},
  isLarge: true,
  isExtraLarge: false,
  safeRows: 0,
  rkTheme: undefined
};

export const ThemeContext = createContext<TThemeContext>(initialValue);

export const FlexibleThemeProvider = ({ children }) => {
  const [mode, setMode] = useLocalStorage<'dark' | 'light'>('theme', 'dark');

  const [isLarge, setLarge] = useState(false);
  const [isExtraLarge, setExtraLarge] = useState(false);
  const [safeRows, setSafeRows] = useState(0);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  const onScreenChange = (mql, mxql) => () => {
    setLarge(mql.matches);
    setExtraLarge(mxql.matches);
  };

  const large = '(min-width: 768px) and (orientation: landscape)';
  const extraLarge = '(min-width: 1280px) and (orientation: landscape)';

  const onDarkPrefChange = query => () => {
    setMode(query.matches ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!mode) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.onchange = onDarkPrefChange(mq);
      onDarkPrefChange(mq)();
    }
    const mql = window.matchMedia(large);
    const mxql = window.matchMedia(extraLarge);
    onScreenChange(mql, mxql)();
    mql.onchange = onScreenChange(mql, mxql);

    if (safeRows === 0) {
      const rows = Math.ceil((window.innerHeight * 0.6 - 112) / 52);
      setSafeRows(rows);
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme(mode === 'dark' ? defaultTheme : defaultLightTheme, overrides(mode))
      ),
    [mode]
  );

  /*
      primary: '#00FF41',
      secondary: '#008F11',
      disabled: '#003B00'
   */

  const rkDarkOptions = {
    overlayBlur: 'none',
    accentColor: '00FF41'
  };

  const rkLightOptions = {
    overlayBlur: 'none'
  };

  const rkTheme = useMemo(
    () => (mode === 'dark' ? darkTheme(rkDarkOptions as any) : lightTheme(rkLightOptions as any)),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, setMode, isLarge, isExtraLarge, safeRows, rkTheme }}>
      <ThemeProvider theme={theme}>{mounted && children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
