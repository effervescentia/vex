import type { App } from '@api/lib';
import { treaty } from '@elysiajs/eden';
import { env } from './app/app.env';

export const client = treaty<App>(env.API_HOST);
