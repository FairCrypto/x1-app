export const decodeXenTorrentMintInfo = (mintInfo: any) => ({
  term: parseInt(`0x${mintInfo.slice(0, 4)}`),
  maturityTs: parseInt(`0x${mintInfo.slice(4, 20)}`),
  rank: parseInt(`0x${mintInfo.slice(20, 52)}`),
  amp: parseInt(`0x${mintInfo.slice(52, 56)}`),
  eaa: parseInt(`0x${mintInfo.slice(56, 60)}`),
  series: parseInt(`0x${mintInfo.slice(60, 62)}`),
  isApex: parseInt(`0x${mintInfo.slice(60, 62)}`) > 128,
  isLimited:
    parseInt(`0x${mintInfo.slice(60, 62)}`) > 64 && parseInt(`0x${mintInfo.slice(60, 62)}`) < 128,
  redeemed: parseInt(`0x${mintInfo.slice(62)}`)
});

export const decodeURI = (dataURI: string) => {
  if (!dataURI) return '';
  const base64EncodedJSON = dataURI.replace('data:application/json;base64,', '');
  const metadataStr = Buffer.from(base64EncodedJSON, 'base64').toString('utf8');
  const metadataJson = JSON.parse(metadataStr);
  return metadataJson.image;
};
