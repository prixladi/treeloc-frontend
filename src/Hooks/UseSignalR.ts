import { useState, useEffect } from 'react';
import {
  HubConnectionBuilder,
  HttpTransportType,
  HubConnectionState,
} from '@aspnet/signalr';

declare const conf: { signalUrl: string };

const createHubConnection = () => {
  return new HubConnectionBuilder()
    .withUrl(conf.signalUrl, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .build();
};

const useSignalR = () => {
  const [connection] = useState(createHubConnection());
  const [version, setVersion] = useState(null as string | null);

  useEffect(() => {
    connection.on('versionChanged', (args) => {
      setVersion(args.version);
    });

    try {
      connection.start();
    } finally {
      const handle = setInterval(() => {
        try {
          if (connection.state !== HubConnectionState.Connected)
            connection.start();
        } catch (err) {
          console.log(err);
        }
      }, 5000);

      return () => {
        try {
          clearInterval(handle);
          connection.stop();
        } catch (err) {
          console.log(err);
        }
      };
    }
  }, [connection]);

  return version;
};

export { useSignalR };
