import { resource } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { MemoForm, type MemoFormValue } from '../../components/memo-form.component';
import { useMemoNotFound } from '../../hooks/use-memo-not-found.hook';

const useMemo = resource((memoID) => client().memo({ memoID }).get());

export interface EditMemoProps {
  memoID: string;
}

export const EditMemo: React.FC<EditMemoProps> = ({ memoID }) => {
  const memo = useMemo(memoID);

  const editMemo = async (data: MemoFormValue) => {
    await client().memo.text({ memoID }).patch({
      content: data.content,
    });

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
