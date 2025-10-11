import { type Static, t } from 'elysia';

export type AccountAlias = Static<typeof AccountAliasDTO>;

export const AccountAliasDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  accountID: t.String({ format: 'uuid' }),
  name: t.String(),
  isActive: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
