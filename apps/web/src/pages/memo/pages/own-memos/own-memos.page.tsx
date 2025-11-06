import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { useAtomValue } from 'jotai';
import { ownMemosAtom } from '../../data/memo.atom';

export const OwnMemos: React.FC = () => {
  const memos = useAtomValue(ownMemosAtom);

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
