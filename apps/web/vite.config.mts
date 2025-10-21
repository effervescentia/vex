import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const PORT = process.env['PORT'];

export default defineConfig({
  plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],

  build: {
    outDir: 'build',
  },

  test: {
    environment: 'jsdom',
    clearMocks: true,
  },

  server: {
    host: '0.0.0.0',
    port: PORT ? Number(PORT) : undefined,
    allowedHosts: true,
  },
});
