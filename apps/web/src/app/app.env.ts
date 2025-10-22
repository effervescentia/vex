import envSchema from 'env-schema';
import z from 'zod';

declare global {
  interface Window {
    vexenv?: any;
  }
}

const EnvironmentDTO = z.object({
  API_HOST: z.string(),
});

export type Environment = z.infer<typeof EnvironmentDTO>;

export const env: Environment = envSchema({
  schema: EnvironmentDTO,
  data: window.vexenv,
});
