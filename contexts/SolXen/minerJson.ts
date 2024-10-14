import json from './sol_xen_miner.json';

const miners = (
  process.env.NEXT_PUBLIC_SOL_XEN_MINERS ||
  'B8HwMYCk1o7EaJhooM4P43BHSk5M8zZHsTeJixqw7LMN,' +
    '2Ewuie2KnTvMLwGqKWvEM1S2gUStHzDUfrANdJfu45QJ,' +
    '5dxcK28nyAJdK9fSFuReRREeKnmAGVRpXPhwkZxAxFtJ,' +
    'DdVCjv7fsPPm64HnepYy5MBfh2bNfkd84Rawey9rdt5S'
).split(',');

export const solXenMiner = (address: string) => ({
  ...json,
  address
});

export const solXenMiner0 = solXenMiner(miners[0]);
export const solXenMiner1 = solXenMiner(miners[1]);
export const solXenMiner2 = solXenMiner(miners[2]);
export const solXenMiner3 = solXenMiner(miners[3]);

export const solXenMiners = [solXenMiner0, solXenMiner1, solXenMiner2, solXenMiner3];
