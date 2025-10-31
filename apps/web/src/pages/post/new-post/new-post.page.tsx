import { env } from '@web/app/app.env';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { unpack } from '@web/utils/request.util';
import { type FormValues, fieldAtom, formAtom, useForm, useTextareaField } from 'form-atoms';

const postFormAtom = formAtom({
  content: fieldAtom({ value: '' }),
});

export const NewPost: React.FC = () => {
  const { fieldAtoms, submit } = useForm(postFormAtom);
  const contentField = useTextareaField(fieldAtoms.content);

  const createPost = async (values: FormValues<typeof postFormAtom>) => {
    const geolocation = await new Promise<GeolocationPosition>((resolve, reject) =>
      window.navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: env.get().GEOLOCATION_TTL }),
    );

    const post = await client()
      .post.text.post({
        geolocation: [geolocation.coords.longitude, geolocation.coords.latitude],
        content: values.content,
      })
      .then(unpack);

    routes.postDetails({ postID: post.id }).push();
  };

  return (
    <div>
      <AppNavigation />
      <form onSubmit={submit(createPost)}>
        <textarea {...contentField.props} />
        <button type="submit">create</button>
      </form>
    </div>
  );
};
