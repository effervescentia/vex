import { resource } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { accountAtom } from '@web/data/account.atom';
import { useAtomValue } from 'jotai';
import { useMemoNotFound } from '../../hooks/use-memo-not-found.hook';

const useMemo = resource((memoID) => client().memo({ memoID }).get());

export interface MemoDetailsProps {
  memoID: string;
}

export const MemoDetails: React.FC<MemoDetailsProps> = ({ memoID }) => {
  const memo = useMemo(memoID);
  const account = useAtomValue(accountAtom);

  const editMemo = () => routes.editMemo({ memoID }).push();

  const deleteMemo = async () => {
    await client().memo({ memoID }).delete();
    routes.ownMemos().replace();
  };

  useMemoNotFound(memo.state === 'notFound');

  if (memo.state !== 'hasData') return null;

  const isAuthor = memo.data.authorID === account?.id;

  return (
    <div>
      <AppNavigation />
      <p>{memo.data.text?.content}</p>
      {isAuthor && (
        <>
          <button type="button" onClick={editMemo}>
            edit
          </button>
          <button type="button" onClick={deleteMemo}>
            delete
          </button>
        </>
      )}
    </div>
  );
};
