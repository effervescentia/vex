import { Home } from '@web/pages/home/home.page';
import { themeClass } from '@web/styles/theme.css';
import { match } from 'ts-pattern';
import { useRoute } from './app.router';

export const App: React.FC = () => {
  const route = useRoute();

  const page = match(route)
    .with({ name: 'home' }, () => <Home />)

    .otherwise(() => null);

  return <div className={themeClass}>{page}</div>;
};
