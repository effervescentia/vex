import Elysia from 'elysia';

export const HealthController = new Elysia({ prefix: '/health' }).get('/', () => 'ok');
