import 'global-jsdom/register';
import '@testing-library/react/dont-cleanup-after-each';

import { afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';
import { hooksCleanup } from '@ver0/react-hooks-testing';

afterEach(() => {
  cleanup();
  hooksCleanup();
});
