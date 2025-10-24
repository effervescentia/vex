import { type Static, t } from 'elysia';

export type SignupChallenge = Static<typeof SignupChallengeResponse>;

export const SignupChallengeResponse = t.Object({});
