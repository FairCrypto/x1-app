import useSwr from 'swr';
// import * as Sentry from '@sentry/nextjs';

const getHexData = async (url: string): Promise<any> =>
  fetch(url)
    .then(res => {
      if (!res.ok) {
        if (res.status === 403) throw new Error('Blacklisted address');
        if (res.status === 400) throw new Error('Configuration error');
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(
      data =>
        // console.log(data);
        data
    );

export const useHexData = (account: string, chainId: number) => {
  const { data, error, isLoading } = useSwr(
    `/api/xhex?account=${account}&chainId=${chainId}`,
    getHexData
  );
  const { result: hexData, signature } = data || {};
  return { hexData, signature, error, isLoading } as {
    hexData: [string, string, string, string];
    signature: `0x${string}`;
    error: any;
    isLoading: boolean;
  };
};
