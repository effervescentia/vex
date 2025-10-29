import { type Static, t } from 'elysia';

export type AuthSession = Static<typeof AuthSessionDTO>;

export const AuthSessionDTO = t.Object({
  id: t.Number(),
  credentialID: t.String({ format: 'uuid' }),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
