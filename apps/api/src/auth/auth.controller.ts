import { AccountService } from '@api/account/account.service';
import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { RedisPlugin } from '@api/redis/redis.plugin';
import jwt from '@elysiajs/jwt';
import Elysia, { Cookie, type CookieOptions, NotFoundError, t } from 'elysia';
import { ACCESS_TOKEN_TTL, LOGIN_TTL, SIGNUP_TTL } from './auth.const';
import { AuthService } from './auth.service';
import { AuthenticatedResponse } from './data/authenticated.res';
import { LoginChallengeResponse } from './data/login-challenge.res';
import { NegotiateLoginRequest } from './data/negotiate-login.req';
import { NegotiateSignupRequest } from './data/negotiate-signup.req';
import { SignupChallengeResponse } from './data/signup-challenge.res';
import { VerifyLoginRequest } from './data/verify-login.req';
import { VerifySignupRequest } from './data/verify-signup.req';

const AUTH_COOKIE: CookieOptions = {
  domain: 'api.vex.localhost',
  sameSite: true,
  httpOnly: true,
  secure: true,
};

export const AuthController = new Elysia({ prefix: '/auth' })
  .use(DatabasePlugin)
  .use(RedisPlugin)
  .use(EnvironmentPlugin)
  .use((app) =>
    jwt({
      name: 'AccessToken',
      secret: app.decorator.env().JWT_AUTH_SECRET,
      schema: t.Object({ sessionID: t.Number() }),
      exp: '10m',
    }),
  )
  .derive({ as: 'scoped' }, ({ db, redis, env, AccessToken }) => ({
    service: new AuthService(db(), redis(), env()),
    accountService: new AccountService(db(), env()),

    refreshAccessToken: async (accessToken: Cookie<string | undefined>, sessionID: number) =>
      accessToken.set({
        ...AUTH_COOKIE,
        value: await AccessToken.sign({ sessionID }),
        maxAge: ACCESS_TOKEN_TTL * 1000,
      }),
  }))

  .post(
    '/signup/negotiate',
    async ({ service, body, cookie: { signupRequestID } }) => {
      const { challenge, requestID } = await service.negotiateSignup(body);

      signupRequestID.set({
        ...AUTH_COOKIE,
        value: requestID,
        maxAge: SIGNUP_TTL * 1000,
      });

      return { challenge };
    },
    {
      body: NegotiateSignupRequest,
      cookie: t.Object({ signupRequestID: t.Optional(t.String()) }),
      response: {
        200: SignupChallengeResponse,
      },
    },
  )

  .post(
    '/signup/verify',
    async ({ service, body, cookie: { signupRequestID, accessToken }, refreshAccessToken }) => {
      const requestID = signupRequestID.value;
      if (!requestID) throw new NotFoundError();
      signupRequestID.remove();

      const { account, session } = await service.verifySignup(requestID, body);

      await refreshAccessToken(accessToken, session.id);

      return { account };
    },
    {
      body: VerifySignupRequest,
      cookie: t.Cookie({
        signupRequestID: t.Optional(t.String()),
        accessToken: t.Optional(t.String()),
      }),
      response: {
        200: AuthenticatedResponse,
      },
    },
  )

  .post(
    '/login/negotiate',
    async ({ service, body, cookie: { loginRequestID } }) => {
      const { challenge, requestID } = await service.negotiateLogin(body);

      loginRequestID.set({
        ...AUTH_COOKIE,
        value: requestID,
        maxAge: LOGIN_TTL * 1000,
      });

      return { challenge };
    },
    {
      body: NegotiateLoginRequest,
      cookie: t.Cookie({
        loginRequestID: t.Optional(t.String()),
      }),
      response: {
        200: LoginChallengeResponse,
      },
    },
  )

  .post(
    '/login/verify',
    async ({ service, body, cookie: { loginRequestID, accessToken }, refreshAccessToken }) => {
      if (!loginRequestID.value) throw new NotFoundError();

      const requestID = loginRequestID.value;
      loginRequestID.remove();

      const { account, session } = await service.verifyLogin(requestID, body);

      await refreshAccessToken(accessToken, session.id);

      return { account };
    },
    {
      body: VerifyLoginRequest,
      cookie: t.Cookie({
        loginRequestID: t.Optional(t.String()),
        accessToken: t.Optional(t.String()),
      }),
      response: {
        200: AuthenticatedResponse,
      },
    },
  )

  .get(
    '/session',
    async ({ service, accountService, cookie: { accessToken }, AccessToken, refreshAccessToken }) => {
      const tokenData = await AccessToken.verify(accessToken.value);
      if (!tokenData) throw new NotFoundError();

      const session = await service.getSession(tokenData.sessionID);
      if (!session) throw new NotFoundError();

      const account = await accountService.getDetails(session.credential.accountID);
      if (!account) throw new NotFoundError();

      await refreshAccessToken(accessToken, session.id);

      return { account };
    },
    {
      cookie: t.Cookie({
        accessToken: t.String(),
      }),
      response: {
        200: AuthenticatedResponse,
      },
    },
  )

  .delete(
    '/session',
    async ({ service, cookie: { accessToken }, AccessToken }) => {
      const tokenString = accessToken.value;
      accessToken.remove();

      const tokenData = await AccessToken.verify(tokenString);
      if (!tokenData) return;

      await service.deleteSession(tokenData.sessionID);
    },
    {
      cookie: t.Cookie({
        accessToken: t.String(),
      }),
    },
  );
