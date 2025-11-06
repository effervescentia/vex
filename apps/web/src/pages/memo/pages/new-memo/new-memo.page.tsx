import { env } from '@web/app/app.env';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { unpack } from '@web/utils/request.util';
import { MemoForm, type MemoFormValue } from '../../components/memo-form.component';
import { ownMemosAtom } from '../../data/memo.atom';

export const NewMemo: React.FC = () => {
  const createMemo = async (data: MemoFormValue) => {
    const geolocation = await new Promise<GeolocationPosition>((resolve, reject) =>
      window.navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: env.get().GEOLOCATION_TTL }),
    );

    const memo = await client()
      .memo.text.post({
        geolocation: [geolocation.coords.longitude, geolocation.coords.latitude],
        content: data.content,
      })
      .then(unpack);

    ownMemosAtom.taint();
    routes.memoDetails({ memoID: memo.id }).push();
  };

  return (
    <div>
      <AppNavigation />
      <MemoForm initialValue={{ content: '' }} submitLabel="create" onSubmit={createMemo} />
    </div>
  );
};
