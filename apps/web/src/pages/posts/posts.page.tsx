import { resources } from '@bltx/web';
import { client } from '@web/client';

const usePosts = resources(() => client().post.get());

export const Posts: React.FC = () => {
  const posts = usePosts();

  if (posts.state !== 'hasData') return null;

  return (
    <div>
      {posts.data.map((post) => (
        <div key={post.id}>{post.text?.content}</div>
      ))}
    </div>
  );
};
