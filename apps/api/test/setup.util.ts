import * as schema from '@api/db/db.schema';
import { integrationTestFactory } from '@bltx/test';

export const setupIntegrationTest = integrationTestFactory(schema);
