import type { Dispatch, SetStateAction } from 'react';

export type TProjectInfo = {
  isInternal?: boolean;
  name: string;
  copyright: 'Copyright ©' | 'Community Project ©' | string;
  owner?: string;
  license?: string;
  web?: string;
  twitter?: string;
  telegram?: string;
  youtube?: string;
  discord?: string;
  reddit?: string;
  whitePaper?: string;
  github?: string;
  logoUrl?: string;
  tokenSymbol?: string;
  contracts?: string[] | null;
  envPrefix?: string[] | null;
  termsText: string;
};

export interface LinkTabProps {
  label?: string;
  value?: string;
  href?: string;
  current?: string;
  theme?: any;
  items?: LinkTabProps[];
  menuEl?: HTMLElement | null;
  setMenuEl?: Dispatch<SetStateAction<HTMLElement | null>>;
  mode?: string;
}
