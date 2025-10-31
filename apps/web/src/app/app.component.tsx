import { Fingerprint } from '@web/pages/fingerprint/fingerprint.page';
import { Home } from '@web/pages/home/home.page';
import { Login } from '@web/pages/login/login.page';
import { NewPost } from '@web/pages/post/new-post/new-post.page';
import { OwnPosts } from '@web/pages/post/own-posts/own-posts.page';
import { PostDetails } from '@web/pages/post/post-details/post-details.page';
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
      { name: 'ownPosts' },
      secure(() => <OwnPosts />),
    )

    .with(
      { name: 'newPost' },
      secure(() => <NewPost />),
    )

    .with(
      { name: 'postDetails' },
      secure(({ params }) => <PostDetails postID={params.postID} />),
    )

    .otherwise(() => null);

  return <div className={themeClass}>{page}</div>;
};
