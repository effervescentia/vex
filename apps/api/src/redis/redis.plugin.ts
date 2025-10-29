import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { RedisClient } from 'bun';
import Elysia from 'elysia';

export const RedisPlugin = new Elysia({ name: 'plugin.redis' })
  .use((app) => {
    const env = EnvironmentPlugin.decorator.env();
    const redis = new RedisClient(
      `redis://${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}@${env.REDIS_HOSTNAME}:${env.REDIS_PORT}`,
    );

    return app.decorate({ redis: () => redis });
  })
  .use(async (app) => {
    await app.decorator.redis().connect();
    return app;
  });
