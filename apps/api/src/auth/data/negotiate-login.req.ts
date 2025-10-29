import { type Static, t } from 'elysia';

export type NegotiateLogin = Static<typeof NegotiateLoginRequest>;

export const NegotiateLoginRequest = t.Object({});
