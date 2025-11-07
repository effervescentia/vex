import { type Static, t } from 'elysia';

export type MemoFeed = Static<typeof MemoFeedRequest>;

export const MemoFeedRequest = t.Object({
  geolocation: t.Tuple([t.Number(), t.Number()]),
  distance: t.Number({ minimum: 1, maximum: 25 }),
});
