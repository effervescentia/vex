import { AccountController } from '@api/account/account.controller';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { HealthController } from '@api/global/health.controller';
import { PostController } from '@api/post/post.controller';
import { LoggerPlugin } from '@bltx/core';
import { cors } from '@elysiajs/cors';
import Elysia from 'elysia';

export type App = typeof App;

export const App = new Elysia()

  .use(cors())
  .use(EnvironmentPlugin)
  // .use(LoggerPlugin)
  .use(HealthController)

  .use(AccountController)
  .use(PostController);
