export const decodeXenTickerInfo = (tickerInfo: string) => ({
  symbol: parseInt(`0x${tickerInfo.slice(0, 8)}`),
  burnTs: parseInt(`0x${tickerInfo.slice(8, 24)}`),
  burned: parseInt(`0x${tickerInfo.slice(24, 56)}`),
  rarityScore: parseInt(`0x${tickerInfo.slice(56, 60)}`),
  rarityBits: parseInt(`0x${tickerInfo.slice(60)}`)
});

export const decodeURI = dataURI => {
  if (!dataURI) return '';
  const base64EncodedJSON = dataURI.replace('data:application/json;base64,', '');
  const metadataStr = Buffer.from(base64EncodedJSON, 'base64').toString('utf8');
  const metadataJson = JSON.parse(metadataStr);
  return metadataJson.image;
};
