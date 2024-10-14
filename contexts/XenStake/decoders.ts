export const decodeXeNFTStakeInfo = stakeInfo => ({
  term: parseInt(`0x${stakeInfo.slice(0, 4)}`),
  maturityTs: parseInt(`0x${stakeInfo.slice(4, 20)}`),
  amount: parseInt(`0x${stakeInfo.slice(20, 52)}`),
  apy: parseInt(`0x${stakeInfo.slice(52, 56)}`),
  rarityScore: parseInt(`0x${stakeInfo.slice(56, 60)}`),
  rarityBits: parseInt(`0x${stakeInfo.slice(60)}`)
});

export const decodeURI = (dataURI: string) => {
  if (!dataURI) return '';
  const base64EncodedJSON = dataURI.replace('data:application/json;base64,', '');
  const metadataStr = Buffer.from(base64EncodedJSON, 'base64').toString('utf8');
  const metadataJson = JSON.parse(metadataStr);
  return metadataJson.image;
};
