import type { TProjectInfo } from '@/config/types';

const projectConfig = {
  xen: {
    isInternal: true,
    name: 'XEN Crypto',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    tokenSymbol: 'XEN',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-crypto',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    whitePaper: 'https://faircrypto.org/xencryptolp.pdf',
    logoUrl: '/favicon.ico',
    contracts: ['contract'],
    envPrefix: ['CONTRACT_ADDRESS'],
    termsText: '/terms'
  },
  xenft: {
    isInternal: true,
    name: 'XENFT',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XENFT',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    whitePaper: 'https://faircrypto.org/xenft_litepaper.pdf',
    logoUrl: '/favicon.ico',
    contracts: ['minter', 'lowBurnMinter', 'staker', 'burner'],
    envPrefix: ['MINTER_ADDRESS', 'LOW_BURN_MINTER_ADDRESS', 'STAKER_ADDRESS', 'BURNER_ADDRESS'],
    termsText: '/terms'
  },
  xenknights: {
    isInternal: true,
    name: 'XENKnights',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['knights'],
    envPrefix: ['KNIGHTS_ADDRESS'],
    termsText: '/terms_knights'
  },
  ticker: {
    isInternal: true,
    name: 'XENTicker',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['ticker'],
    envPrefix: ['TICKER_ADDRESS'],
    termsText: '/terms'
  },
  tokenizer: {
    isInternal: true,
    name: 'XENTokenizer',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['tokenizer'],
    envPrefix: ['TOKENIZER_ADDRESS'],
    termsText: '/terms'
  },
  varstaker: {
    isInternal: true,
    name: 'XENVarStaker',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['varStaker'],
    envPrefix: ['VARSTAKER_ADDRESS'],
    termsText: '/terms'
  },
  xeth: {
    isInternal: true,
    name: 'xETH',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['xEth'],
    envPrefix: ['XETH_ADDRESS'],
    termsText: '/terms'
  },
  xhex: {
    isInternal: true,
    name: 'XHEX',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['xHex'],
    envPrefix: ['XHEX_ADDRESS'],
    termsText: '/terms'
  },
  dbxen: {
    name: 'DBXen',
    copyright: 'Community Project ©',
    tokenSymbol: 'DXN',
    web: 'https://dbxen.org',
    twitter: 'https://twitter.com/DBXen_crypto',
    github: 'https://github.com/deb0x/dbXenBurnerProject',
    whitePaper: 'https://dbxen.gitbook.io/dbxen-litepaper/',
    telegram: 'https://t.me/+_Q3prZI35gJkZmI0',
    contracts: ['dbXen', 'dbXenViews', 'dxnToken'],
    envPrefix: ['DBXEN_ADDRESS', 'DBXEN_VIEWS_ADDRESS', 'DXN_TOKEN_ADDRESS'],
    termsText: '/terms_community'
  },
  xenlonmars: {
    name: 'Xenlon Mars',
    copyright: 'Community Project ©',
    web: 'https://www.xenlonmars.com/',
    tokenSymbol: 'XLON',
    github: 'https://github.com/xenlonmars/xenlonmars',
    twitter: 'https://twitter.com/xenlonmars',
    contracts: ['xenlonMars', 'xlonToken'],
    envPrefix: ['XENLON_MARS_ADDRESS', 'XLON_TOKEN_ADDRESS'],
    termsText: '/terms_community'
  },
  fenix: {
    name: 'Fenix',
    copyright: 'Community Project ©',
    web: 'https://fenix.fyi',
    tokenSymbol: 'FENIX',
    logoUrl: '/logos/fenix-logo.svg',
    twitter: 'https://twitter.com/fenix_protocol',
    telegram: 'https://t.me/fenix_protocol',
    github: 'https://github.com/atomizexyz',
    whitePaper: 'http://github.com/atomizexyz/litepaper',
    contracts: ['fenix'],
    envPrefix: ['FENIX_ADDRESS'],
    termsText: '/terms_community'
  },
  xone: {
    isInternal: true,
    name: 'XONE',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['xone'],
    envPrefix: ['XONE_ADDRESS'],
    termsText: '/terms'
  },
  vmpx: {
    isInternal: true,
    name: 'VMPX',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['vmpx'],
    envPrefix: ['VMPX_ADDRESS'],
    termsText: '/terms'
  },
  moonParty: {
    isInternal: true,
    name: 'MoonParty',
    copyright: 'Copyright ©',
    owner: 'Fair Crypto Foundation',
    license: 'All Rights Reserved. ',
    web: 'https://faircrypto.org',
    twitter: 'https://twitter.com/XEN_Crypto',
    telegram: 'https://t.me/XENCryptoTalk',
    youtube: 'https://m.youtube.com/channel/UCiw5nyHHt9BPHvoRbcGNehA/playlists',
    github: 'https://github.com/FairCrypto/XEN-Knights',
    discord: 'https://discord.com/invite/rcAhrKWJb6',
    reddit: 'https://www.reddit.com/r/xencrypto/',
    logoUrl: '/favicon.ico',
    contracts: ['moonParty'],
    envPrefix: ['MOONPARTY_ADDRESS'],
    termsText: '/terms'
  }
};

export const projects: Record<string, TProjectInfo> = projectConfig;
