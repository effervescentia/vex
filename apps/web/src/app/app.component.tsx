/** biome-ignore-all lint/correctness/useHookAtTopLevel: <explanation> */
import { accountAtom } from '@web/data/account.atom';
import { useSetup } from '@web/hooks/use-setup.hook';
import { Fingerprint } from '@web/pages/fingerprint/fingerprint.page';
import { Home } from '@web/pages/home/home.page';
import { Login } from '@web/pages/login/login.page';
import { Signup } from '@web/pages/signup/signup.page';
import { themeClass } from '@web/styles/theme.css';
import { useAtomValue } from 'jotai';
import { type JSX } from 'react';
import { match } from 'ts-pattern';
import { routes, useRoute } from './app.router';

const secure =
  <A extends any[]>(factory: (...args: A) => JSX.Element) =>
  (...args: A) => {
    const account = useAtomValue(accountAtom);

    useSetup(() => {
      if (account) return;

      routes.login().replace();
    });

    return account ? factory(...args) : null;
  };

const unsecure =
  <A extends any[]>(factory: (...args: A) => JSX.Element) =>
  (...args: A) => {
    const account = useAtomValue(accountAtom);

    useSetup(() => {
      if (!account) return;

      routes.home().replace();
    });

    return account ? null : factory(...args);
  };

export const App: React.FC = () => {
  const route = useRoute();

  const page = match(route)
    .with(
      { name: 'home' },
      secure(() => <Home />),
    )

    .with({ name: 'fingerprint' }, () => <Fingerprint />)

    .with(
      { name: 'signup' },
      unsecure(() => <Signup />),
    )

    .with(
      { name: 'login' },
      unsecure(() => <Login />),
    )

    .otherwise(() => null);

  return <div className={themeClass}>{page}</div>;
};
