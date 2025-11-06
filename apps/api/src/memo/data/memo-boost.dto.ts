import { type Static, t } from 'elysia';

export type MemoBoost = Static<typeof MemoBoostDTO>;

export const MemoBoostDTO = t.Object({
  memoID: t.String({ format: 'uuid' }),
  accountID: t.String({ format: 'uuid' }),
  createdAt: t.Date(),
});
