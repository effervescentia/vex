import { DatabasePlugin } from '@api/db/db.plugin';
import Elysia from 'elysia';
import { AuthService } from './auth.service';
import { NegotiateSignupRequest } from './data/negotiate-signup.req';
import { SignupChallengeResponse } from './data/signup-challenge.res';

export const AuthController = new Elysia({ prefix: '/auth' })
  .use(DatabasePlugin)
  .derive({ as: 'scoped' }, ({ db }) => ({ service: new AuthService(db()) }))

  .post(
    '/signup/negotiate',
    async ({ service, body }) => {
      return service.negotiateSignup(body);
    },
    {
      body: NegotiateSignupRequest,
      response: {
        200: SignupChallengeResponse,
      },
    },
  );
