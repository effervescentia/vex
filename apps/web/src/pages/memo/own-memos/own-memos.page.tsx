import { resources } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';

const useMemos = resources(() => client().memo.get());

export const OwnMemos: React.FC = () => {
  const memos = useMemos();

  if (memos.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      {memos.data.map((memo) => (
        <div key={memo.id}>
          <p>{memo.text?.content}</p>
          <a {...routes.memoDetails({ memoID: memo.id }).link}>details</a>
        </div>
      ))}
    </div>
  );
};
