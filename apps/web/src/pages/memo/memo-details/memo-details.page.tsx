import { resource } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { client } from '@web/client';

const useMemo = resource((memoID) => client().memo.details({ memoID }).get());

export interface MemoDetailsProps {
  memoID: string;
}

export const MemoDetails: React.FC<MemoDetailsProps> = ({ memoID }) => {
  const memo = useMemo(memoID);

  if (memo.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      <p>{memo.data.text?.content}</p>
    </div>
  );
};
