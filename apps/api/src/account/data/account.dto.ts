import { type Static, t } from 'elysia';

export type Account = Static<typeof AccountDTO>;

export const AccountDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  description: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
