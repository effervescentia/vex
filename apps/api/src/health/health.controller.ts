import { DatabasePlugin } from '@api/db/db.plugin';
import { RedisPlugin } from '@api/redis/redis.plugin';
import Elysia from 'elysia';
import { HealthService } from './health.service';

export const HealthController = new Elysia({ prefix: '/health' })
  .use(DatabasePlugin)
  .use(RedisPlugin)
  .derive({ as: 'scoped' }, ({ db, redis }) => ({ service: new HealthService(db(), redis()) }))

  .get('/ready', async ({ service }) => {
    await service.assertReady();

    return 'ok';
  })

  .get('/live', async ({ service }) => {
    await service.assertLive();

    return 'ok';
  });
