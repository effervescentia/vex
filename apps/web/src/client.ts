import type { App } from '@api/lib';
import { treaty } from '@elysiajs/eden';

export const client = treaty<App>('localhost:3000');
