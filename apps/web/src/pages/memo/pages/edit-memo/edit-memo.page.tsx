import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { unpack } from '@web/utils/request.util';
import { useAtom } from 'jotai';
import { MemoForm, type MemoFormValue } from '../../components/memo-form.component';
import { memoAtom, ownMemosAtom } from '../../data/memo.atom';
import { useMemoNotFound } from '../../hooks/use-memo-not-found.hook';

export interface EditMemoProps {
  memoID: string;
}

export const EditMemo: React.FC<EditMemoProps> = ({ memoID }) => {
  const [memo, setMemo] = useAtom(memoAtom(memoID));

  const editMemo = async (data: MemoFormValue) => {
    const updated = await client().memo.text({ memoID }).patch({ content: data.content }).then(unpack);
    setMemo(updated);

    ownMemosAtom.taint();
    routes.memoDetails({ memoID }).push();
  };

  useMemoNotFound(memo.state === 'notFound');

  if (memo.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      {!!memo.data.text && (
        <MemoForm initialValue={{ content: memo.data.text.content }} submitLabel="update" onSubmit={editMemo} />
      )}
    </div>
  );
};
