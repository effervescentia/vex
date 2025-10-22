import { DatabasePlugin } from '@api/db/db.plugin';
import { sql } from 'drizzle-orm';
import Elysia from 'elysia';

export const HealthController = new Elysia({ prefix: '/health' })
  .use(DatabasePlugin)

  .get('/ready', async ({ db, status }) => {
    if (!db?.()) return status(404, 'database client not found');

    const count = await db()
      .$count(sql`(SELECT 1)`)
      .catch(() => 0);

    if (count !== 1) return status(404, 'database client not ready');

    return 'ok';
  })

  .get('/live', async ({ db, status }) => {
    const count = await db()
      .$count(sql`(SELECT NOW())`)
      .catch(() => 0);

    if (count !== 1) return status(404, 'database client not responding');

    return 'ok';
  });
