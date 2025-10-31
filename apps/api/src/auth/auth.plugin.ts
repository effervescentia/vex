import type { Account } from '@api/account/data/account.dto';
import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { eq } from 'drizzle-orm';
import Elysia, { type CookieOptions, t } from 'elysia';
import { ACCESS_TOKEN_TTL } from './auth.const';
import { AuthSessionService } from './auth-session.service';
import { AuthSessionDB } from './data/auth-session.db';

export const AUTH_COOKIE: CookieOptions = {
  domain: 'api.vex.localhost',
  sameSite: true,
  httpOnly: true,
  secure: true,
};

export const AuthPlugin = new Elysia({ name: 'plugin.auth' })
  .guard({ as: 'scoped', cookie: t.Cookie({ accessToken: t.Optional(t.String()) }) })
  .macro({
    authenticated: {
      resolve: async ({ headers, cookie: { accessToken }, status }) => {
        if (import.meta.env.NODE_ENV === 'test') {
          if (!headers['test-principal']) return status(401);

          return {
            principal: { id: headers['test-principal'] } as Account,
          };
        }

        const sessionService = new AuthSessionService(DatabasePlugin.decorator.db(), EnvironmentPlugin.decorator.env());
        try {
          if (typeof accessToken.value !== 'string') return status(401);

          const tokenData = await sessionService.accessToken.verify(accessToken.value);
          if (!tokenData) return status(401);

          const session = await DatabasePlugin.decorator.db().query.AuthSessionDB.findFirst({
            where: eq(AuthSessionDB.id, tokenData.sessionID),
            with: { credential: { with: { account: true }, columns: {} } },
            columns: {},
          });
          if (!session) return status(401);

          accessToken.set({
            ...AUTH_COOKIE,
            value: await sessionService.accessToken.sign({ sessionID: tokenData.sessionID }),
            maxAge: ACCESS_TOKEN_TTL * 1000,
          });

          return { principal: session.credential.account };
        } catch (err) {
          accessToken?.remove();
          throw err;
        }
      },
    },
  });
