import { describe, expect, test } from 'bun:test';
import type { Environment } from '@api/app/app.env';
import { ForbiddenError } from '@api/global/forbidden.error';
import { AccountAliasService } from './account-alias.service';

describe('AccountAliasService', () => {
  describe('#update()', () => {
    test('throw error if max aliases have been reached', async () => {
      const accountID = 'account-id';
      const service = new AccountAliasService({ $count: () => 4 } as any, { ACCOUNT_MAX_ALIASES: 3 } as Environment);

      try {
        await service.update(accountID, { name: 'foo' });

        expect().fail('max aliases have been exceeded');
      } catch (err) {
        expect(err).toEqual(new ForbiddenError('Maximum of 3 aliases are associated with this account'));
      }
    });
  });
});
