import { type Static, t } from 'elysia';
import { PostVisibility } from './post-visibility.enum';

export type Post = Static<typeof PostDTO>;

export const PostDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  authorID: t.String({ format: 'uuid' }),
  visibility: t.Enum(PostVisibility),
  geolocation: t.Tuple([t.Number(), t.Number()]),
  deletedAt: t.Nullable(t.Date()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
