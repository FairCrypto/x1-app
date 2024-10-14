export type TInscription = {
  address: string;
  content: string;
  contentBody: string;
  contentLength: number;
  contentType: string;
  genesisTransaction: string;
  inscriptionId: string;
  inscriptionNumber: number;
  location: string;
  offset: number;
  output: string;
  outputValue: number;
  preview: string;
  timestamp: number;
  utxoConfirmation: number;
  utxoHeight: number;
};

export type TBRCAsset = {
  id?: string;
  p: string;
  op: string;
  tick: string;
  amt: string;
};
