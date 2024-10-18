'use client';

import { Connection } from '@solana/web3.js';
import type RpcWebSocketClient from '@solana/web3.js/src/rpc-websocket';
import { useEffect, useState } from 'react';

const connection: Connection | any = new Connection('http://64.20.44.66:8899', {
  wsEndpoint: 'ws://64.20.44.66:8900'
});

export const useBlock = (onBlock?) => {
  // const { connection } = useContext(X1Context);

  const [client, setClient] = useState<RpcWebSocketClient | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!ws) {
      const newWs = new WebSocket('ws://64.20.44.66:8900');
      newWs.onopen = () => {
        console.log('ws open');
        newWs.send('{"jsonrpc":"2.0","id":1,"method":"blockSubscribe","params":["all"]}');
      };
      newWs.onclose = () => {
        console.log('ws close');
      };
      newWs.onerror = console.error;
      newWs.onmessage = m => {
        console.log('ws message', m);
      };
      setWs(newWs);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [!!ws]);

  useEffect(() => {
    let onBlockId;
    let wsc;
    if (connection) {
      // console.log('ws', connection?._rpcWebSocket as RpcWebSocketClient);
      wsc = connection?._rpcWebSocket as RpcWebSocketClient;
      setClient(wsc);
      wsc.autoconnect = true;
      wsc.setAutoReconnect(true);
      wsc.on('message', console.error);
      wsc.on('close', q => {
        console.log('close', q);
        // wsc.connect();
      });
      wsc.on('blockNotification', params => {
        // if (params.method === 'blockNotification') {
        onBlock(params);
        // }
      });
      if (wsc) {
        wsc.on('open', () => {
          console.log('open', wsc);
          wsc.call('blockSubscribe', ['all']).catch(console.error);
        });
      }
      // wsc.connect();
    }
    return () => {
      if (connection) {
        // connection.removeSlotUpdateListener(onBlockId);
      }
      if (wsc) {
        // wsc.close();
      }
    };
  }, [!!connection]);

  return { client, ws };
};
