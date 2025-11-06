import { routes } from '@web/app/app.router';
import { useEffect } from 'react';

export const useMemoNotFound = (notFound: boolean) =>
  useEffect(() => {
    if (notFound) {
      routes.ownMemos().replace();
    }
  }, [notFound]);
