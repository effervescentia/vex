import { t } from 'elysia';
import { LOGIN_TTL } from '../auth.const';

export const LoginCookie = t.Cookie(
  {
    loginRequestID: t.Optional(t.String()),
  },
  {
    maxAge: LOGIN_TTL * 1000,
  },
);
