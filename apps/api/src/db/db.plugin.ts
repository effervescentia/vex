import { createDatabasePlugin } from '@bltx/db';
import * as schema from './db.schema';

export const DatabasePlugin = createDatabasePlugin(schema);
