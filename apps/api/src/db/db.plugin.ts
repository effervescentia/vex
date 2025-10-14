// import { createDatabaseClient, createDatabasePlugin } from '@bltx/db';
import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import Elysia from 'elysia';
import * as schema from './db.schema';
import { EnvironmentPlugin } from '@api/global/environment.plugin';

// export const DatabasePlugin = createDatabasePlugin(schema);
export const DatabasePlugin = new Elysia({ name: 'plugin.database' }).use(EnvironmentPlugin).use((app) => {
  // const client = createDatabaseClient({ dataDir: './data.db' });
  const client = new SQL({
    database: app.decorator.env.POSTGRES_DATABASE,
    username: app.decorator.env.POSTGRES_USERNAME,
    password: app.decorator.env.POSTGRES_PASSWORD,
  });
  const db = drizzle({ client, schema });

  return app.decorate({ db: () => db });
});
