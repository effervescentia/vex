import { DialogProvider } from '@bltx/web';

import { RouteProvider } from './app.router';

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <RouteProvider>
    <DialogProvider>{children}</DialogProvider>
  </RouteProvider>
);
