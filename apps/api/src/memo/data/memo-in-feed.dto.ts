import { type Static, t } from 'elysia';
import { MemoWithContentDTO } from './memo-with-content.dto';

export type MemoInFeed = Static<typeof MemoInFeedDTO>;

export const MemoInFeedDTO = t.Composite([
  MemoWithContentDTO,
  t.Object({
    boosted: t.Boolean(),
  }),
]);
