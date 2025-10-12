import { type Static, t } from 'elysia';

export type PostBoost = Static<typeof PostBoostDTO>;

export const PostBoostDTO = t.Object({
  postID: t.String({ format: 'uuid' }),
  accountID: t.String({ format: 'uuid' }),
  createdAt: t.Date(),
});
