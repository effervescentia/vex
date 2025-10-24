import { type Static, t } from 'elysia';

export type NegotiateSignup = Static<typeof NegotiateSignupRequest>;

export const NegotiateSignupRequest = t.Object({
  challenge: t.String(),
});
