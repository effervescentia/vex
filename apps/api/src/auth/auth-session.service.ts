import type { Environment } from '@api/app/app.env';
import type { DB } from '@api/db/db.types';
import { DataService } from '@api/global/data.service';
import jwt from '@elysiajs/jwt';
import { eq } from 'drizzle-orm';
import { t } from 'elysia';
import { AuthSessionDB } from './data/auth-session.db';

const AccessToken = t.Object({ sessionID: t.Number() });

export class AuthSessionService extends DataService {
  public readonly accessToken: ReturnType<typeof jwt<'jwt', typeof AccessToken>>['decorator']['jwt'];

  constructor(db: DB, env: Environment) {
    super(db);

    this.accessToken = jwt({
      secret: env.JWT_AUTH_SECRET,
      schema: AccessToken,
      exp: '10m',
    }).decorator.jwt;
  }

  async get(sessionID: number) {
    return this.db.query.AuthSessionDB.findFirst({
      where: eq(AuthSessionDB.id, sessionID),
      with: { credential: true },
    });
  }

  async delete(sessionID: number) {
    await this.db.delete(AuthSessionDB).where(eq(AuthSessionDB.id, sessionID));
  }
}
