import type { Environment } from '@api/app/app.env';
import * as schema from '@api/db/db.schema';
import { integrationTestFactory } from '@bltx/test';

export const setupIntegrationTest = integrationTestFactory(schema, {
  PORT: 8080,

  POSTGRES_DATABASE: 'test',
  POSTGRES_USERNAME: 'test',
  POSTGRES_PASSWORD: 'test',

  ACCOUNT_MAX_ALIASES: 3,
  ACCOUNT_ALIAS_EXPIRY_SHORT: 1000,
  ACCOUNT_ALIAS_EXPIRY_LONG: 10000,
} satisfies Environment);
