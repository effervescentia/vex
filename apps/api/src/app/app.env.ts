import { DurationDTO } from '@api/global/data/duration.dto';
import { type Static, t } from 'elysia';

export const Environment = t.Object({
  PORT: t.Number(),

  POSTGRES_HOSTNAME: t.String(),
  POSTGRES_PORT: t.Number(),
  POSTGRES_DATABASE: t.String(),
  POSTGRES_USERNAME: t.String(),
  POSTGRES_PASSWORD: t.String(),

  ACCOUNT_MAX_ALIASES: t.Number(),
  ACCOUNT_ALIAS_EXPIRY_SHORT: DurationDTO,
  ACCOUNT_ALIAS_EXPIRY_LONG: DurationDTO,
});

export type Environment = Static<typeof Environment>;
