import { defineConfig } from 'drizzle-kit';

declare global {
  interface ImportMetaEnv {
    POSTGRES_HOSTNAME: string;
    POSTGRES_PORT: string;
    POSTGRES_USERNAME: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DATABASE: string;
  }
}

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/db/db.schema.ts',

  dbCredentials: {
    host: import.meta.env.POSTGRES_HOSTNAME,
    port: Number(import.meta.env.POSTGRES_PORT),
    user: import.meta.env.POSTGRES_USERNAME,
    password: import.meta.env.POSTGRES_PASSWORD,
    database: import.meta.env.POSTGRES_DATABASE,
    ssl: false,
  },
});
