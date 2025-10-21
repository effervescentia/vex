import type { DatabaseLike } from '@bltx/db';
import type * as schema from './db.schema';

export type DB = DatabaseLike<typeof schema>;
