import type { Database } from '@bltx/db';
import type * as schema from './db.schema';

export type DB = Database<typeof schema>;
