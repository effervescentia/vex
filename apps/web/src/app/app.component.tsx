import { Fingerprint } from '@web/pages/fingerprint/fingerprint.page';
import { Home } from '@web/pages/home/home.page';
import { Signup } from '@web/pages/signup/signup.page';
import { themeClass } from '@web/styles/theme.css';
import { match } from 'ts-pattern';
import { useRoute } from './app.router';

export const App: React.FC = () => {
  const route = useRoute();

  const page = match(route)
    .with({ name: 'home' }, () => <Home />)

    .with({ name: 'fingerprint' }, () => <Fingerprint />)

    .with({ name: 'signup' }, () => <Signup />)

    .otherwise(() => null);

  return <div className={themeClass}>{page}</div>;
};
