import { Environment } from '@api/app/app.env';
import { createEnvironmentPlugin } from '@bltx/core';

export const EnvironmentPlugin = createEnvironmentPlugin(Environment);
