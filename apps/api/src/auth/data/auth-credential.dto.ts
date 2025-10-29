import { type Static, t } from 'elysia';
import { AuthAlgorithm } from './auth-algorithm.enum';
import { AuthTransportDTO } from './auth-transport.enum';

export type AuthCredential = Static<typeof AuthCredentialDTO>;

export const AuthCredentialDTO = t.Object({
  id: t.String(),
  publicKey: t.String(),
  algorithm: t.Enum(AuthAlgorithm),
  transports: t.Array(AuthTransportDTO),

  createdAt: t.Date(),
  updatedAt: t.Date(),
});
