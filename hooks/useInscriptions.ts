'use client';

import useSWRInfinite from 'swr/infinite';

import type { TBRCAsset, TInscription } from '@/contexts/Btc/types';

const getKey = (urls: TInscription[]) => (pageIndex: number) => {
  // reached the end
  if (pageIndex > urls.length - 1) return null;

  // add the cursor to the API endpoint
  return urls[pageIndex];
};

export const useInscriptions = (assets: TInscription[], pageSize: number = 4) => {
  console.log(assets);
  const { data, isLoading, error, setSize } = useSWRInfinite(
    getKey(assets),
    (asset: TInscription) =>
      fetch(asset.content)
        .then(res => res.json())
        .then(json => ({ ...json, id: asset.inscriptionId }))
        .catch(() => ({ id: asset.inscriptionId, p: 'other' })),
    { initialSize: pageSize, parallel: true }
  );
  return { data: data as TBRCAsset[], isLoading, error, setSize };
};
