import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { LoggerPlugin } from '@bltx/core';
import { cors } from '@elysiajs/cors';
import { DrizzleQueryError } from 'drizzle-orm/errors';
import Elysia from 'elysia';

export type App = typeof App;

export const App = new Elysia()
  .onError((err) => {
    if (err instanceof DrizzleQueryError) {
      console.error(err.query);
      console.error(err.message);
      console.error(err.cause);
      return err;
    }

    console.log(err);
  })

  .use(cors())
  .use(EnvironmentPlugin)
  .use(LoggerPlugin);
