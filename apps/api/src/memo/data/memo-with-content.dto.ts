import { TextContentDTO } from '@api/content/data/text-content.dto';
import { type Static, t } from 'elysia';
import { PostDTO } from './memo.dto';

export type PostWithContent = Static<typeof PostWithContentDTO>;

export const PostWithContentDTO = t.Composite([
  PostDTO,
  t.Object({
    text: t.Nullable(t.Omit(TextContentDTO, ['postID'])),
  }),
]);
