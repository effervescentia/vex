import { DialogProvider } from '@bltx/web';
import { useEffect } from 'react';
import { env } from './app.env';
import { RouteProvider } from './app.router';

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  useEffect(() => env.init(), []);

  return (
    <RouteProvider>
      <DialogProvider>{children}</DialogProvider>
    </RouteProvider>
  );
};
