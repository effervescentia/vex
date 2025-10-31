import { accountAtom } from '@web/data/account.atom';
import { useSetup } from '@web/hooks/use-setup.hook';
import { useAtomValue } from 'jotai';
import type { JSX } from 'react';
import { routes } from './app.router';

export const secure =
  <A extends any[]>(factory: (...args: A) => JSX.Element) =>
  (...args: A) => {
    const account = useAtomValue(accountAtom);

    useSetup(() => {
      if (account) return;

      routes.login().replace();
    });

    return account ? factory(...args) : null;
  };

export const unsecure =
  <A extends any[]>(factory: (...args: A) => JSX.Element) =>
  (...args: A) => {
    const account = useAtomValue(accountAtom);

    useSetup(() => {
      if (!account) return;

      routes.home().replace();
    });

    return account ? null : factory(...args);
  };
