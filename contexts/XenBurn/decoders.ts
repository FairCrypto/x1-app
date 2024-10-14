export const decodeXenBurnInfo = burnInfo => ({
  burnTs: parseInt(`0x${burnInfo.slice(4, 20)}`),
  burned: parseInt(`0x${burnInfo.slice(20, 52)}`),
  rarityScore: parseInt(`0x${burnInfo.slice(56, 60)}`),
  rarityBits: parseInt(`0x${burnInfo.slice(60)}`)
});

export const decodeURI = dataURI => {
  if (!dataURI) return '';
  const base64EncodedJSON = dataURI.replace('data:application/json;base64,', '');
  const metadataStr = Buffer.from(base64EncodedJSON, 'base64').toString('utf8');
  const metadataJson = JSON.parse(metadataStr);
  return metadataJson.image;
};
