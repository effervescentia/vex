import type { Account } from '@api/account/data/account.dto';
import { UnauthorizedError } from '@api/app/app.error';
import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { AuthSessionService } from './auth-session.service';
import { AuthSessionDB } from './data/auth-session.db';

export const AuthPlugin = new Elysia({ name: 'plugin.auth' })
  .guard({ as: 'scoped', cookie: t.Cookie({ accessToken: t.Optional(t.String()) }) })
  .macro({
    authenticated: {
      resolve: async ({ cookie: { accessToken } }) => {
        if (import.meta.env.NODE_ENV === 'test') {
          return { principal: { id: 'test' } as Account };
        }
        const sessionService = new AuthSessionService(DatabasePlugin.decorator.db(), EnvironmentPlugin.decorator.env());
        try {
          if (typeof accessToken.value !== 'string') throw new UnauthorizedError();
          const tokenData = await sessionService.accessToken.verify(accessToken.value);
          if (!tokenData) throw new UnauthorizedError();
          const session = await DatabasePlugin.decorator.db().query.AuthSessionDB.findFirst({
            where: eq(AuthSessionDB.id, tokenData.sessionID),
            with: { credential: { with: { account: true }, columns: {} } },
            columns: {},
          });
          if (!session) throw new UnauthorizedError();
          accessToken.value = await sessionService.accessToken.sign({ sessionID: tokenData.sessionID });
          return { principal: session.credential.account };
        } catch (err) {
          accessToken?.remove();
          throw err;
        }
      },
    },
  });
