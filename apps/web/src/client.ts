import type { App } from '@api/lib';
import { treaty } from '@elysiajs/eden';
import { env } from './app/app.env';

export const client = () => treaty<App>(env.get().API_HOST, { fetch: { credentials: 'include' } });
