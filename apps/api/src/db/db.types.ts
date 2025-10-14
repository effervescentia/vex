import type { AnyRecord } from '@bltx/core';
import type { Transaction } from '@bltx/db';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import type * as schema from './db.schema';

export type Database<Schema extends AnyRecord> = PgDatabase<any, Schema> | Transaction<Schema>;

export type DB = Database<typeof schema>;
