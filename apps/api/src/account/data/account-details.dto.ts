import { type Static, t } from 'elysia';
import { AccountDTO } from './account.dto';
import { AccountAliasDTO } from './account-alias.dto';

export type AccountDetails = Static<typeof AccountDetailsDTO>;

export const AccountDetailsDTO = t.Composite([
  AccountDTO,
  t.Object({
    aliases: t.Array(t.Omit(AccountAliasDTO, ['accountID'])),
  }),
]);
