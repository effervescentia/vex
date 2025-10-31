import { resources } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';

const usePosts = resources(() => client().post.get());

export const OwnPosts: React.FC = () => {
  const posts = usePosts();

  if (posts.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      {posts.data.map((post) => (
        <div key={post.id}>
          <p>{post.text?.content}</p>
          <a {...routes.postDetails({ postID: post.id }).link}>details</a>
        </div>
      ))}
    </div>
  );
};
