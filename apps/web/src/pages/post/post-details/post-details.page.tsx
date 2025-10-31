import { resource } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { client } from '@web/client';

const usePost = resource((postID) => client().post.details({ postID }).get());

export interface PostDetailsProps {
  postID: string;
}

export const PostDetails: React.FC<PostDetailsProps> = ({ postID }) => {
  const post = usePost(postID);

  if (post.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      <p>{post.data.text?.content}</p>
    </div>
  );
};
