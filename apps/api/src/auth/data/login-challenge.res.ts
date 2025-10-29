import { type Static, t } from 'elysia';

export type LoginChallenge = Static<typeof LoginChallengeResponse>;

export const LoginChallengeResponse = t.Object({
  challenge: t.String(),
});
