import { Fingerprint } from '@web/pages/fingerprint/fingerprint.page';
import { Home } from '@web/pages/home/home.page';
import { Login } from '@web/pages/login/login.page';
import { EditMemo } from '@web/pages/memo/pages/edit-memo/edit-memo.page';
import { MemoDetails } from '@web/pages/memo/pages/memo-details/memo-details.page';
import { NewMemo } from '@web/pages/memo/pages/new-memo/new-memo.page';
import { OwnMemos } from '@web/pages/memo/pages/own-memos/own-memos.page';
import { Signup } from '@web/pages/signup/signup.page';
import { themeClass } from '@web/styles/theme.css';
import { match } from 'ts-pattern';
import { useRoute } from './app.router';
import { secure, unsecure } from './app.util';

export const App: React.FC = () => {
  const route = useRoute();

  const page = match(route)

    .with({ name: 'fingerprint' }, () => <Fingerprint />)

    .with(
      { name: 'signup' },
      unsecure(() => <Signup />),
    )

    .with(
      { name: 'login' },
      unsecure(() => <Login />),
    )

    .with(
      { name: 'home' },
      secure(() => <Home />),
    )

    .with(
      { name: 'ownMemos' },
      secure(() => <OwnMemos />),
    )

    .with(
      { name: 'newMemo' },
      secure(() => <NewMemo />),
    )

    .with(
      { name: 'memoDetails' },
      secure(({ params }) => <MemoDetails memoID={params.memoID} />),
    )

    .with(
      { name: 'editMemo' },
      secure(({ params }) => <EditMemo memoID={params.memoID} />),
    )

    .otherwise(() => null);

  return <div className={themeClass}>{page}</div>;
};
