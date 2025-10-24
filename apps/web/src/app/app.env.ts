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

class AppEnvironment {
  private value: Environment | null = null;
  private failed = false;

  init() {
    if (this.failed) return;

    if (this.value) {
      console.warn('environment is already initialized');
      return;
    }

    try {
      this.value = EnvironmentDTO.parse(window.vexenv);
    } catch (err) {
      console.error('environment failed to initialize, subsequent attempts will be ignored');
      this.failed = true;
      throw err;
    }
  }

  get() {
    if (!this.value) throw new Error('environment must be initialized first');

    return this.value;
  }
}

export const env = new AppEnvironment();
