import '@bltx/web/styles.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import { App } from './app/app.component';
import { AppProvider } from './app/app.provider';

// biome-ignore lint/style/noNonNullAssertion: #root should always exist
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback="Failed">
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
