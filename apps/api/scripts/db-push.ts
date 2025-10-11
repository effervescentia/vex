import { DatabasePlugin } from '@api/db/db.plugin';
import * as schema from '@api/db/db.schema';
import { dbPush } from '@bltx/db';

await dbPush(DatabasePlugin.decorator.db, schema);
