import { type Static, t } from 'elysia';

export type UpdateAccountAlias = Static<typeof UpdateAccountAliasRequest>;

export const UpdateAccountAliasRequest = t.Object({
  name: t.String({ minLength: 3, pattern: '^[_a-z][_a-z\\d]+$' }),
});
