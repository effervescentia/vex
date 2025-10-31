import { env } from '@web/app/app.env';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { unpack } from '@web/utils/request.util';
import { type FormValues, fieldAtom, formAtom, useForm, useTextareaField } from 'form-atoms';

const memoFormAtom = formAtom({
  content: fieldAtom({ value: '' }),
});

export const NewMemo: React.FC = () => {
  const { fieldAtoms, submit } = useForm(memoFormAtom);
  const contentField = useTextareaField(fieldAtoms.content);

  const createMemo = async (values: FormValues<typeof memoFormAtom>) => {
    const geolocation = await new Promise<GeolocationPosition>((resolve, reject) =>
      window.navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: env.get().GEOLOCATION_TTL }),
    );

    const memo = await client()
      .memo.text.post({
        geolocation: [geolocation.coords.longitude, geolocation.coords.latitude],
        content: values.content,
      })
      .then(unpack);

    routes.memoDetails({ memoID: memo.id }).push();
  };

  return (
    <div>
      <AppNavigation />
      <form onSubmit={submit(createMemo)}>
        <textarea {...contentField.props} />
        <button type="submit">create</button>
      </form>
    </div>
  );
};
