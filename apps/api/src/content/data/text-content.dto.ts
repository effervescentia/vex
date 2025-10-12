import { type Static, t } from 'elysia';

export type TextContent = Static<typeof TextContentDTO>;

export const TextContentDTO = t.Object({
  postID: t.String({ format: 'uuid' }),
  content: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
